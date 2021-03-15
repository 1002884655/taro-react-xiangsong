import React, { useState } from 'react'
import { Swiper, SwiperItem } from '@tarojs/components'
import nav2detail from '@/utils/nav2detail'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WuYeBanner (props) {

  const { List = [] } = props

  return (
    <view className='WuYeBanner'>
      <Swiper className='BannerSwiper' autoplay circular indicator-dots indicator-color='rgba(0,0,0,0.4)' indicator-active-color='rgba(255,255,255,0.8)'>
        {
          List.map((item, index) => (
            <SwiperItem className='SwiperItem' key={`Banner-${index}`}>
              <view className='BannerItem' onClick={() => nav2detail({ type: item.contentType, id: item.targetId })}>
                <image mode='aspectFill' src={item.image}></image>
              </view>
            </SwiperItem>
          ))
        }
      </Swiper>
    </view>
  )
}
