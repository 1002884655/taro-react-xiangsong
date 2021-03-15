import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function NavHeader (props) {

  const [MarginTop, setMarginTop] = useState(0)
  const [LineHeight, setLineHeight] = useState(0)
  const { BgColor = '#fff', IsFixed = false, Title = '香颂蔚澜', Color = '#fff', Border = false } = props

  if (MarginTop === 0) {
    setMarginTop(Taro.getMenuButtonBoundingClientRect().top)
  }
  if (LineHeight === 0) {
    setLineHeight(Taro.getMenuButtonBoundingClientRect().height)
  }

  return (
    <view className='NavHeader' style={{ background: BgColor, position: IsFixed ? 'absolute' : 'relative' }}>
      <text style={{ marginTop: `${MarginTop}px`, lineHeight: `${LineHeight}px`, color: `${Color}`, borderBottom: Border ? `1px solid #ccc` : `none` }}>{Title}</text>
    </view>
  )
}
