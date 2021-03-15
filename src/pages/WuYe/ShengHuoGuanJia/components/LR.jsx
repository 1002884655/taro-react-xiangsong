import React, { useEffect, useState } from 'react'
import './style.less'

export default props => {
  // const [] = useState()


  // useEffect(() => {

  // }, [])


  return (
    <view className="gj-lr">
      <view className="gj-lr-left">{`${props.title}: `}</view>
      <view className="gj-lr-right">{props.children}</view>
    </view>
  )
}
