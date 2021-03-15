import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function CustomHeader (props) {

  const [MarginTop, setMarginTop] = useState(0)
  const [LineHeight, setLineHeight] = useState(0)
  const { BgColor = '#fff', IsFixed = false, Title = '香颂蔚澜' } = props

  if (MarginTop === 0) {
    setMarginTop(Taro.getMenuButtonBoundingClientRect().top)
  }
  if (LineHeight === 0) {
    setLineHeight(Taro.getMenuButtonBoundingClientRect().height)
  }

  return (
    <view className='CustomHeader' style={{ background: BgColor, position: IsFixed ? 'fixed' : 'relative' }}>
      <text className='iconfont iconjiantouleft Back' style={{ top: `${MarginTop}px`, lineHeight: `${LineHeight}px` }} onClick={() => { Taro.navigateBack() }}></text>
      <text className='Title' style={{ marginTop: `${MarginTop}px`, lineHeight: `${LineHeight}px` }}>{Title}</text>
    </view>
  )
}
