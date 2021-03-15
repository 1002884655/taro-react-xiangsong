import React, { useState } from 'react'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function SlidePopup (props) {

  const { Close = () => { }, Show = false } = props

  return (
    <view className={Show ? 'SlidePopup active' : 'SlidePopup'}>
      <view>
        <view className='Title'>
          <text className='iconfont iconguanbi1 Close' onClick={Close}></text>
        </view>
        <view className='PopupContent'>
          {
            props.children
          }
        </view>
      </view>
    </view>
  )
}
