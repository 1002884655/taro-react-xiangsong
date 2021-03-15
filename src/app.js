import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { StoreRoot, store } from './store'
// import { deepCopy } from './utils'
import request, { apis } from './utils/request'
import { trackUserSource } from './utils/track'
import log from './utils/rtLog'
import './app.less'

class App extends Component {
  updateTracing;

  onLaunch () {

    // Taro.setEnableDebug({
    //   enableDebug: true
    // })
    // 此处获取不到 state, 因为 app 不会刷新
    const { setSysInfo } = store.getModel('sys').getState()

    // 预拉取数据
    wx.getBackgroundFetchData({
      fetchType: 'pre',
      success (res) {
        if (res.errMsg === 'getBackgroundFetchData:ok') {
          const data = JSON.parse(res.fetchedData)
          if (data.code === 1000) {
            setSysInfo(data.data)
          }
        }
      }
    })
  }

  onError (err) {
    log.error(err)
  }

  // 在此处是为了兼容热启动
  componentDidShow () {
    const { setUser } = store.getModel('user').getState()
    const { setAppParams } = store.getModel('appParams').getState()

    // 保存刚进入系统时的router
    const router = getCurrentInstance().router

    // 如果是分享或者扫码
    // scene 与其它参数时互斥的. 有 scene 说明时扫码进来的
    const params = router.params || {}
    const { from = '', recommender = '', scene = '', mpOpenId = '' } = params
    setAppParams({ ...params })

    // 登录
    Taro.login({
      success: res => {
        if (res.errMsg === 'login:ok') {
          request({ ...apis.login, params: { code: res.code, from, recommender, scene, mpOpenId } }).then(x => {
            setUser({ ...x.person, ShowIndexAdv: false, FirstComing: true, communityId: x.houseList !== null && x.houseList.length ? x.houseList[0].communityId : null, roomId: x.houseList !== null && x.houseList.length ? x.houseList[0].id : null, roleId: x.houseList !== null && x.houseList.length ? x.houseList[0].roleId : null })
            Taro.setStorage({ key: 'token', data: x.token })
            Taro.setStorage({ key: 'sessionKey', data: x.sessionKey })

            if (x.scene) {
              setAppParams({
                ...params,
                ...x.scene
              })
            }

            // 埋点
            trackUserSource(router, x.scene).then(res => this.updateTracing = res)
          })
        }
      }
    })
  }

  componentDidHide () {
    if (this.updateTracing) {
      this.updateTracing()
    }
  }

  componentWillUnmount () {
    if (this.updateTracing) {
      this.updateTracing()
    }
  }

  // this.props.children 是将要会渲染的页面
  render () {
    return (
      <StoreRoot>
        {this.props.children}
      </StoreRoot>
    )
  }
}

export default App
