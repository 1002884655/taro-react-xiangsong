import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function NewsListItem (props) {

  const { ShowTips, Data } = props

  return (
    <view className='NewsListItem flex-h' onClick={() => { Taro.navigateTo({ url: `/pages/HuoDong/ZiXunDetail/index?id=${Data.newsId}` }) }}>
      <view className='Img'>
        <image mode='aspectFill' src={Data.newsImg}></image>
        {
          ShowTips &&
          <text>置顶</text>
        }
      </view>
      <view className='Info flex-item'>
        <text>{Data.newsName}</text>
        <text>于{Data.createDate}发布</text>
      </view>
    </view>
  )
}
