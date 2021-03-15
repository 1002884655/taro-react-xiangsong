import React, { useState } from 'react'
import { PERSON_TYPE } from '@/utils/constants'
import { useModel } from '@/store'
import Taro from '@tarojs/taro'
import toolclass from '@/utils/toolclass.js'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function Item (props) {

  const { user } = useModel('user')
  const { Data } = props

  // 随便一条
  const verifyInfo = Data.userVerifyList[0] || {}
  const ownerInfo = `业主信息: ${verifyInfo.ownerName} ${verifyInfo.phone}`
  const roomInfo = `${verifyInfo.phaseName} ${verifyInfo.buildingName} ${verifyInfo.unitName} ${verifyInfo.roomNoName}`

  const handleClick = () => {
    if (verifyInfo.phone) {
      Taro.makePhoneCall({
        phoneNumber: verifyInfo.phone
      })
    }
  }

  return (
    <view className='YeZhuBaoXiuItem'>
      <view className='Title flex-h'>
        <text className='iconfont icongonggongquyu'></text>
        <text className='flex-item'>{Data.repairName}问题</text>
        <text className='Time'>{toolclass.FormatDate(Data.createDate)}</text>
      </view>
      <view className='Name flex-h'>
        <view className='flex-item'><text>{Data.ticketTitle}</text></view>
        {
          Data.status - 0 === 3 && user && user.personType === PERSON_TYPE.LIFE_CONSULTANT && <view className="Name-action" onClick={props.onAction}>完成</view>    
        }
      </view>
      <view className='Detail flex-h'>
        <view className='Line'><view></view></view>
        <view className='flex-item' onClick={handleClick}>
          <view className='flex-h'>
            <view className='flex-item'><text>{Data.ticketStatusName}</text></view>
            <view className='Time'><text>{toolclass.FormatDate(Data.ticketRecordDate)}</text></view>
          </view>
          <view className='Desc'>
            <rich-text nodes={`${ownerInfo}<br />${roomInfo}`}></rich-text>
          </view>
          {/* <view className='Desc'>您的报修已经分配给物业处理人员<text className='Name'>郭培军</text>处理，联系方式<text className='Phone'>18266666666</text></view> */}
        </view>
      </view>
    </view>
  )
}
