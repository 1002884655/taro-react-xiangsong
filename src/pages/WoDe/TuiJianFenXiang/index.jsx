import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import CustomHeader from '@/components/CustomHeader/index'
import Page from '@/layouts'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function TuiJianFenXiang (props) {

  return (
    <Page>
      <view className='TuiJianFenXiang'>
        <CustomHeader IsFixed={true} BgColor='none' Title='推荐分享'></CustomHeader>
        <image mode='widthFix' src='https://zhiyun-image.oss-cn-shanghai.aliyuncs.com/xiangsong/img1.jpg'></image>
      </view>
    </Page>
  )
}
