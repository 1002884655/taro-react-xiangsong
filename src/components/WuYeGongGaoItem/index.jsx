import React, { } from 'react'
import Taro from '@tarojs/taro'
import toolclass from '@/utils/toolclass.js'
import { RichText } from '@tarojs/components'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WuYeGongGaoItem (props) {

  const { Data = {} } = props

  return (
    <view className='WuYeGongGaoItem' onClick={() => { Taro.navigateTo({ url: `/pages/WuYe/GongGaoDetail/index?id=${Data.id}` }) }}>
      <view className='Title flex-h'>
        <text className='flex-item'>{Data.announcementTitle}</text>
        <text>{toolclass.FormatDate(Data.createDate, 'YY:MM:DD')}</text>
      </view>
      <view className='GaoItemContent'>
        <RichText nodes={Data.announcementContent}></RichText>
        <view className='flex-h'>
          <view><text>{Data.createUser}</text></view>
          <view><text>物业</text></view>
          <view className='flex-item'></view>
          <view><text className='iconfont iconguankan'></text></view>
          <view><text>{Data.viewCount}人观看</text></view>
        </view>
      </view>
    </view>
  )
}
