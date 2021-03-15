import React, { } from 'react'
import AddYeZhuRenZheng from '@/components/AddYeZhuRenZheng'
import { ScrollView } from '@tarojs/components'
import { useModel } from '@/store'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function YeZhuRenZhengPopup (props) {

  const { user } = useModel('user')
  const { Show = false, Close = () => { } } = props

  return (
    <view className={Show ? 'YeZhuRenZhengPopup active' : 'YeZhuRenZhengPopup'}>
      <view className='centerLabel'>
        <view>
          {
            user.verifyStatus !== 'certified' && user.verifyStatus !== 'certification_in_progress' &&
            <ScrollView scroll-y='true'>
              {
                Show &&
                <AddYeZhuRenZheng Close={Close}></AddYeZhuRenZheng>
              }
            </ScrollView>
          }
          {
            user.verifyStatus === 'certification_in_progress' &&
            <view className='Checking'>
              <text>认证正在审核中</text>
            </view>
          }
        </view>
      </view>
    </view>
  )
}
