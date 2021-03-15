import React, { useEffect, useState } from 'react'
import './style.less'

export default props => {
  // const [] = useState()


  // useEffect(() => {

  // }, [])


  return (
    <view className="gj-btn" onClick={props.onClick}>
      {props.children}
    </view>
  )
}
