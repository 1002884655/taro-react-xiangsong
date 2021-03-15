import React, { useState } from 'react'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function UploadImg (props) {

  return (
    <view className='UploadImg'>
      <view className='Add'>
        <view className='centerLabel'>
          <text className='iconfont iconxiangji'></text>
          <text>添加照片</text>
        </view>
      </view>
      <view className='ImgItem'>
        <text className='iconfont iconguanbi'></text>
        <image mode='aspectFit' src={null}></image>
      </view>
    </view>
  )
}
