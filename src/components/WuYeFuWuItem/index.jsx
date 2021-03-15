import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import toolclass from '@/utils/toolclass.js'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WuYeFuWuItem (props) {

  const { Data } = props

  return (
    <view className='WuYeFuWuItem flex-h' onClick={() => { Taro.navigateTo({ url: `/pages/WuYe/FuWuDetail/index?id=${Data.newsId}` }) }}>
      <view className='Img'>
        <image mode='aspectFill' src={Data.newsImg} className='centerLabel'></image>
      </view>
      <view className='flex-item'>
        <text>{Data.newsName}</text>
        <text>于{toolclass.FormatDate(Data.createDate)}发布</text>
      </view>
    </view>
  )
}
