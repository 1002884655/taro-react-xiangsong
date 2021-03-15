import React, { useEffect, useState } from 'react'
import LR from './LR'
import Btn from './Btn'
import Stars from './Stars'
import './style.less'

export default props => {

  const { PostScore = () => { } } = props

  const handleClick = () => {
    if (props.onClick) {
      props.onClick(props.dataSource)
    }
  }

  const handleAction = () => {
    if (props.onAction) {
      props.onAction(props.dataSource)
    }
  }

  const data = props.dataSource || {}

  return (
    <view className='gj-card'>
      <view className='gj-card-body' onClick={handleClick}>
        <view className='gj-card-body-media'>
          <image mode='aspectFill' src={data.photo} />
        </view>
        <view className='gj-card-content'>
          <LR title='管家姓名'>{data.userName || ''}</LR>
          <LR title='联系方式'>{data.phone || ''}</LR>
          <LR title='管家说明'>{data.description || ''}</LR>
          <LR title='综合评价'>
            {
              data.averageScore !== null &&
              <Stars total={data.averageScore - 0} editable />
            }
            {
              data.averageScore === null &&
              <text>暂无评分</text>
            }
          </LR>
        </view>
      </view>
      <view className='gj-card-footer'>
        <view>
          {`工号: ${data.jobNumber || ''}`}
        </view>
        <view className='gj-card-footer-action' style={{ textAlign: 'right' }}>
          <Btn onClick={PostScore(data)}>评星</Btn>
        </view>
      </view>
    </view>
  )
}
