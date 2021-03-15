import React, { useState } from 'react'
import ScrollPageRefresh from '@/components/ScrollPageRefresh'
import AddYeZhuRenZheng from '@/components/AddYeZhuRenZheng'
import { useDidShow } from '@tarojs/taro'
import toolclass from '@/utils/toolclass.js'
import request, { apis } from '@/utils/request'
import Taro from '@tarojs/taro'
import Page from '@/layouts'
import { useModel } from '@/store'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'
import { useEffect } from 'react'

export default function WoDeRenZheng () {

  const { user, setUser } = useModel('user')
  const [PageList, setPageList] = useState([])
  const [ShowAddLayer, setShowAddLayer] = useState(false)
  const [IsEmpty, setIsEmpty] = useState(false)
  const [Reset, setReset] = useState(false)

  useDidShow(() => {
    if (user.verifyStatus === 'certified') {
      setReset(true)
    } else {
      Taro.login({
        success: res => {
          if (res.errMsg === 'login:ok') {
            request({ ...apis.login, params: { code: res.code, from: '', recommender: '', scene: '', mpOpenId: '' } }).then((cRes) => {
              setUser({ ...user, ...cRes.person })
              setReset(true)
            })
          }
        }
      })
    }
  })

  // useEffect(() => {
  //   if (user.verifyStatus === 'certified') {
  //     setReset(true)
  //   }
  // }, [user])

  const Refresh = (e) => { // 下拉刷新
    if (e.length > 0) {
      setIsEmpty(false)
      setPageList(e)
    } else {
      setIsEmpty(true)
    }
  }

  const Push = (e) => { // 上拉加载
    setPageList(PageList.concat(e))
  }

  const SetDefaultRoom = (item) => {
    return () => {
      if (item.id - 0 !== user.roomId - 0) {
        setUser({ ...user, communityId: item.communityId, roomId: item.id, roleId: item.roleId })
      }
    }
  }


  return (
    <Page>
      <view className='WoDeRenZheng'>
        <ScrollPageRefresh IsEmpty={IsEmpty} AutoRequest={false} Reset={Reset} CloseReset={() => { setReset(false) }} ApiName={`getOwnerVerifyList`} ListName={null} Refresh={Refresh} Push={Push}>
          <view className='Content Activity'>
            {
              PageList.map((item, index) => (
                <view className='ListItem' key={`RenZhengItem-${index}`}>
                  <text onClick={() => { Taro.navigateTo({ url: `/pages/WoDe/YeZhuShenHe/index?id=${item.id}` }) }}>{item.phaseName}{item.buildingName}{item.unitName}{item.levelName}{item.roomNoName}</text>
                  <view className='flex-h'>
                    <view className='flex-item' onClick={() => { Taro.navigateTo({ url: `/pages/WoDe/YeZhuShenHe/index?id=${item.id}` }) }}>
                      <text>{item.roleName || '户主'}：{item.ownerName} {item.phone}</text>
                      <text>{toolclass.FormatDate(item.createDate)}</text>
                    </view>
                    <view>
                      {
                        item.verifyStatus - 0 === 1 &&
                        <text className={item.id - 0 === user.roomId - 0 ? 'Btn' : 'Btn active'} onClick={SetDefaultRoom(item)}>{item.id - 0 === user.roomId - 0 ? '默认房产' : '设为默认'}</text>
                      }
                      <text className={item.verifyStatus - 0 === 0 ? '' : item.verifyStatus - 0 === 1 ? 'Green' : 'Red'}>{item.verifyStatus - 0 === 0 ? '审核中' : item.verifyStatus - 0 === 1 ? '审核通过' : '审核未通过'}</text>
                    </view>
                  </view>
                </view>
              ))
            }
            <view className='AddBtn'>
              <text onClick={() => { Taro.navigateTo({ url: `/pages/WoDe/YeZhuRenZheng/index` }) }}>添加认证</text>
              {/* <text onClick={() => { setShowAddLayer(true) }}>添加认证</text> */}
            </view>
          </view>
        </ScrollPageRefresh>
        <view className={ShowAddLayer ? 'AddRenZhengLayer active' : 'AddRenZhengLayer'}>
          <view className='centerLabel'>
            <view>
              <scroll-view scroll-y='true'>
                {
                  ShowAddLayer &&
                  <AddYeZhuRenZheng Close={() => { setShowAddLayer(false) }}></AddYeZhuRenZheng>
                }
              </scroll-view>
            </view>
          </view>
        </view>
      </view>
    </Page>
  )
}
