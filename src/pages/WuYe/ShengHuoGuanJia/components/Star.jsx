import React, { useEffect, useRef, useState } from 'react'

export default props => {
  const clsName = [
    props.className,
    props.active ? props.activeClass : false
  ].filter(Boolean).join(' ')

  const handleClick = e => {
    if (props.onClick) {
      props.onClick(e)
    }
  }

  return <text className='iconfont iconxingxing' style='display: inline-block; vertical-align: middle; font-size: 36rpx; color: #fcdc1e;' onClick={handleClick}></text>
}
