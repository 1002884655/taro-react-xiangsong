import React, { } from 'react'
import Taro from '@tarojs/taro'
import toolclass from '@/utils/toolclass.js'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function ActivityListItem (props) {

  const { Data } = props

  const BtnStatus = () => { // 按钮状态
    if (Data.activityStatus - 0 === 0) { // 进行中
      if (Data.isSign - 0 === 1) {
        return `已报名`
      } else {
        return `已开始`
      }
    } else if (Data.activityStatus - 0 === 1) { // 未开始
      if (Data.isSign - 0 === 1) {
        return `已报名`
      } else {
        return `去报名`
      }
    } else { // 已结束
      return `已结束`
    }
  }

  return (
    <view className='ActivityListItem' onClick={() => { Taro.navigateTo({ url: `/pages/HuoDong/HuoDongDetail/index?id=${Data.dynamicId}` }) }}>
      <view className='Img'>
        <image mode='aspectFill' src={Data.listImgUrl} className='centerLabel'></image>
      </view>
      <view className='Info flex-h'>
        <view className='flex-item'>
          <text>{Data.title}</text>
          <text>参与截止时间：{toolclass.FormatDate(Data.enlistEnd)}</text>
        </view>
        <text className={BtnStatus() === '未开始' || BtnStatus() === '去报名' ? 'active' : ''}>{BtnStatus()}</text>
      </view>
    </view>
  )
}
