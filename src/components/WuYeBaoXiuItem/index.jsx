import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import toolclass from '@/utils/toolclass.js'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WuYeBaoXiuItem (props) {

  const { Data } = props

  const ItemClick = () => {
    Taro.navigateTo({ url: `/pages/WuYe/BaoXiuDetail/index?id=${Data.id}` })
  }

  return (
    <view className='WuYeBaoXiuItem'>
      <view className='Title flex-h' onClick={ItemClick}>
        <text className='iconfont icongonggongquyu'></text>
        <text className='flex-item'>{Data.repairName}问题</text>
        <text className='Time'>{toolclass.FormatDate(Data.createDate)}</text>
      </view>
      <view className='Name flex-h'>
        <text className='flex-item' onClick={ItemClick}>{Data.ticketTitle}</text>
        <text className='iconfont iconbianji' style={{display: Data.status - 0 === 0 ? 'block' : 'none'}} onClick={() => { Taro.navigateTo({ url: `/pages/WuYe/XiuGaiBaoXiu/index?id=${Data.id}` }) }}></text>
      </view>
      <view className='Detail flex-h' onClick={ItemClick}>
        <view className='Line'><view></view></view>
        <view className='flex-item'>
          <view className='flex-h'>
            <view className='flex-item'><text>{Data.ticketStatusName}</text></view>
            <view className='Time'><text>{toolclass.FormatDate(Data.ticketRecordDate)}</text></view>
          </view>
          <view className='Desc'>
            <text>{Data.ticketStatusContent}</text>
          </view>
          {/* <view className='Desc'>您的报修已经分配给物业处理人员<text className='Name'>郭培军</text>处理，联系方式<text className='Phone'>18266666666</text></view> */}
        </view>
      </view>
    </view>
  )
}
