import React, { useEffect, useState } from 'react'
import './style.less'

export default props => {
  const handleClick = e => {
    if (props.onClick) {
      props.onClick(e)
    }
  }

  return (
    <view className="fw-icon-block" onClick={handleClick} style={props.style || {}}>
      <view>
        <view className="fw-icon-block-icon">
          <image mode="" src={props.icon} />
        </view>
        <view className="fw-icon-block-title">{props.title}</view>
      </view>
    </view>
  )
}
