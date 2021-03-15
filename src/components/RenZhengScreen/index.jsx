import React, { useState } from 'react'
import NavHeader from '@/components/NavHeader/index'
import Taro from '@tarojs/taro'
import { useModel } from '@/store'
import request, { apis } from '@/utils/request'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function RenZhengScreen (props) {

  const { Show = false } = props
  const { user, setUser } = useModel('user')
  const [DataLock, setDataLock] = useState(false)

  const RefreshUserInfo = () => {
    if (DataLock) return
    setDataLock(true)
    request({ ...apis.getUserInfo }).then((res) => {
      setUser({ ...user, ...res })
      setDataLock(false)
    }).catch((res) => {
      setDataLock(false)
      Taro.showToast({ title: res, icon: 'none' })
    })
  }

  return (
    <view className='RenZhengScreen' style={{ display: Show ? 'block' : 'none' }}>
      <NavHeader Title='业主认证' Color='#000'></NavHeader>
      <view className='centerLabel'>
        {
          user !== null &&
          <text className='Tips'>{user.verifyStatus === 'not_certified' ? '请进行业主信息认证' : user.verifyStatus === 'certification_in_progress' ? '业主认证中,请等待物业审核' : user.verifyStatus === 'certified' ? '业主认证通过' : '业主验证未通过，请重新验证'}</text>
        }
        <view>
          {/* {
            user !== null && user.verifyStatus !== 'certification_in_progress' && user.verifyStatus !== 'certified' &&
            <text onClick={() => { Taro.navigateTo({ url: `/pages/WoDe/YeZhuRenZheng/index?from=popup` }) }} className='active'>去认证</text>
          } */}
          {
            user !== null &&
            <text onClick={() => { Taro.navigateTo({ url: `/pages/WoDe/YeZhuRenZheng/index?from=popup` }) }} className='active'>去认证</text>
          }
          {/* <text onClick={RefreshUserInfo} className={DataLock ? '' : 'active'}>{DataLock ? '正在刷新...' : '刷新人员信息'}</text> */}
        </view>
      </view>
    </view>
  )
}
