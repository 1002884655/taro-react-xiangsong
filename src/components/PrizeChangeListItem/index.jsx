import React, { } from 'react'
import Taro from '@tarojs/taro'
import toolclass from '@/utils/toolclass.js'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function PrizeChangeListItem (props) {

  const { Data } = props

  return (
    <view className='PrizeChangeListItem flex-h' onClick={() => { Taro.navigateTo({ url: `/pages/FuLi/ShangPinXiangQing/index?id=${Data.targetId}` }) }}>
      <view className='Img'>
        <image mode='aspectFill' src={Data.image}></image>
      </view>
      <view className='flex-item'>
        <text>{Data.targetName}</text>
        <text>{Data.points}积分</text>
        <text>兑换时间：{toolclass.FormatDate(Data.createDate)}</text>
        <text className={Data.status - 0 === 1 ? '' : 'active'}>{Data.status - 0 === 1 ? '已领取' : '未领取'}</text>
      </view>
    </view>
  )
}
