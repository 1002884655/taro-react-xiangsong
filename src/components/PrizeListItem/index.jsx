import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function PrizeListItem (props) {

  const { Data } = props

  return (
    <view className='PrizeListItem' onClick={() => { Taro.navigateTo({ url: `/pages/FuLi/ShangPinXiangQing/index?id=${Data.goodsId}` }) }}>
      <view className='Img'>
        <image mode='aspectFill' src={Data.imgUrl} className='centerLabel'></image>
      </view>
      <view className='Info'>
        <text>{Data.goodsName}</text>
        <view className='flex-h'>
          <view className='Count'><text>{Data.totalNum}</text></view>
          <view className='flex-item'><text>人已兑换</text></view>
          <view className='Num'><text>{Data.pointPrice}</text></view>
          <view><text>积分</text></view>
        </view>
      </view>
    </view>
  )
}
