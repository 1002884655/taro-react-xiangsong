import React, { useState, useEffect, useMemo } from 'react'
import NavHeader from '@/components/NavHeader/index'
import Taro from '@tarojs/taro'
import { Block } from '@tarojs/components'
import request, { apis } from '@/utils/request'
import { useModel } from '@/store'
import Page from '@/layouts'
import { PERSON_TYPE } from '@/utils/constants'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

// 二维数组用于页面美化加分隔栏
// personTypes 用于指定人员身份
const menuGroup = [
  [
    { icon: 'iconrenzheng1', name: '业主认证', id: 1, router: '/pages/WoDe/WoDeRenZheng/index' },
    { icon: 'iconjifenguize', name: '积分明细', id: 2, router: '/pages/FuLi/JiFenMingXi/index' },
    { icon: 'iconjiaofei', name: '缴费历史', id: 3, router: '/pages/WoDe/WoDeJiaoFei/index' },
    { icon: 'iconfuwu1', name: '我的报修', id: 4, router: '/pages/WoDe/WoDeGongDan/index' },
    { icon: 'iconyijianfankui', name: '时刻在聆听', id: 10, router: '/pages/ShouYe/YeZhuFanKui/index' },
  ],
  [
    { icon: 'iconerweima', name: '推荐二维码', id: 5, router: '/pages/WoDe/TuiJianErWeiMa/index' },
    // { icon: 'iconfenxiang', name: '推荐分享', id: 6, router: '/pages/WoDe/TuiJianFenXiang/index' },
    { icon: 'iconhuodong', name: '参与活动', id: 7, router: '/pages/WoDe/WoDeHuoDong/index' },
    { icon: 'icondingdan', name: '我的订单', id: 8, router: '/pages/WoDe/WoDeDingDan/index' }
  ],
  [
    { icon: 'iconfuwu1', name: '管家工单', id: 9, router: '/pages/WoDe/YeZhuBaoXiu/index', personTypes: [PERSON_TYPE.LIFE_CONSULTANT] },
  ]
]

export default function WoDe () {

  const { user, setUser } = useModel('user')
  const [DataLock, setDataLock] = useState(false)

  const menuList = useMemo(() => {
    return menuGroup.map(menus => menus.filter(menu => {
      return (!menu.personTypes || !menu.personTypes.length || menu.personTypes.indexOf(user.personType) > -1)
    })).filter(menus => menus && menus.length)
  }, [user.personType])

  useEffect(() => {
    if (user !== null) {
      request({ ...apis.getUserInfo }).then((res) => {
        setUser({ ...user, ...res })
      }).catch((res) => {
        Taro.showToast({ title: res, icon: 'none' })
      })
    }
  }, [])

  const ToSign = () => { // 签到
    if (DataLock || (user.havaSigned !== undefined && user.havaSigned - 0 === 1)) return
    setDataLock(true)
    request({ ...apis.userSign }).then(() => {
      Taro.showToast({ title: '签到成功，积分+1', icon: 'none' })
      setUser({ ...user, havaSigned: 1, points: user.points - 0 > 0 ? user.points - 0 + 1 : 1 })
      setDataLock(false)
    }).catch((res) => {
      Taro.showToast({ title: res, icon: 'none' })
      setDataLock(false)
    })
  }

  return (
    <Page>
      <view className='WoDe'>
        <NavHeader BgColor='none' Title='我的' IsFixed={true}></NavHeader>
        <view className='WoDeContent'>

          {/* 顶部背景图 */}
          <view className='TopBg'>
            <view className='ColorBg'></view>
            <view className='UserInfo flex-h'>
              <view className='Icon' onClick={() => { Taro.navigateTo({ url: '/pages/WoDe/GeRenXinXi/index' }) }}>
                <image mode='aspectFill' src={user.avatarurl} class='centerLabel'></image>
              </view>
              <view className='flex-item' onClick={() => { Taro.navigateTo({ url: '/pages/WoDe/GeRenXinXi/index' }) }}>
                <text>{user.name || user.nickname || '暂未授权用户信息'}</text>
                <text>{(user.tel || user.phone) ? `${user.tel || user.phone} ${user.roleId - 0 === 1 ? '户主' : user.roleId - 0 === 2 ? '租客' : user.roleId - 0 === 3 ? '家属' : ''}` : '游客'}</text>
              </view>
              {
                user.havaSigned !== undefined &&
                <text onClick={ToSign}>{user.havaSigned - 0 === 1 ? '已签到' : '签到'}</text>
              }
            </view>
          </view>

          {/* 用户选项 */}
          <view className='UserTab'>
            {
              menuList.map((menus, inx) => {
                return (
                  <Block key={inx}>
                    {
                      inx > 0 && <view className='Line'></view>
                    }
                    {
                      menus.map((item, index) => (
                        <view key={`UserTab-${index}`} className='flex-h' onClick={() => { Taro.navigateTo({ url: item.router }) }}>
                          <text className={`iconfont ${item.icon}`}></text>
                          <view className='flex-h flex-item'>
                            <text className='flex-item'>{item.name}</text>
                            <text className='iconfont iconjiantouright'></text>
                          </view>
                        </view>
                      ))
                    }
                  </Block>
                )
              })
            }
          </view>

        </view>
      </view>
    </Page>
  )
}
