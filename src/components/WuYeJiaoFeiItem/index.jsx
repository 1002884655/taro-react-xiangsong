import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import toolclass from '@/utils/toolclass.js'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WuYeJiaoFeiItem (props) {

  const { Data } = props

  const handleClick = () => {
    // Taro.navigateTo({ url: `/pages/WuYe/JiaoFeiDetail/index?id=${Data.id}`})
  }

  return (
    // <view className='WuYeJiaoFeiItem' onClick={handleClick}>
    //   <view className='Title flex-h'>
    //     <text className='flex-item'>物业费</text>
    //     <text>2020/06/08  0:00截止</text>
    //   </view>
    //   <view className='JiaoFeiContent'>
    //     <view className='Name flex-h'>
    //       <text className='flex-item'>2020年5月物业管理费</text>
    //       <text>剩余缴费时间</text>
    //       <text className='Num'>3</text>
    //       <text>天</text>
    //     </view>
    //     <text>垃圾费：300元</text>
    //     <text>电费：300.83元</text>
    //     <text>物业费：300元</text>
    //     <view className='Price flex-h'>
    //       <text className='Num'>340</text>
    //       <text>元</text>
    //       <view className='flex-item'></view>
    //       <text className='Btn'>立即缴费</text>
    //     </view>
    //   </view>
    // </view>
    <view className='WuYeJiaoFeiItem flex-h' onClick={() => { Taro.navigateTo({ url: `/pages/WuYe/JiaoFeiDetail/index?id=${Data.id}` }) }}>
      <view className='flex-item'>
        <text>{Data.billName}</text>
        {/* <text>订单号：{Data.outTradeNo}</text> */}
        <text>{toolclass.FormatDate(Data.createDate)}</text>
      </view>
      <view>
        <text>{Data.payPrice}元</text>
        <text>{Data.isTicket ? '维修费' : '物业费'}</text>
      </view>
    </view>
  )
}
