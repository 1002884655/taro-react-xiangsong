import React, { useState } from 'react'
import toolclass from '@/utils/toolclass.js'
import Taro from '@tarojs/taro'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WuYeFuWuListItem (props) {

  const { Data = null } = props

  return (
    <view className='WuYeFuWuListItem flex-h' onClick={() => { Taro.navigateTo({ url: `/pages/WuYe/FuWuDetail/index?id=${Data.newsId}` }) }}>
      <view className='Img'>
        <image mode='aspectFill' src={Data.newsImg}></image>
      </view>
      <view className='flex-item'>
        <text>{Data.newsName}</text>
        <view>
          {/* <text>沪房更新（2020）87号</text> */}
          <text>{toolclass.FormatDate(Data.createDate)}</text>
        </view>
      </view>
    </view>
  )
}
