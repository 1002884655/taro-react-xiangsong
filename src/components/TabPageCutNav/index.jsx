import React, { } from 'react'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function (props) {

  const { List = [], CurrentNavId = null, NavChange = () => { } } = props
  return (
    <view className='TabPageCutNav'>
      <view>
        <view className='flex-h'>
          {
            List.map((item, index) => (
              <view className='flex-item' key={`TabPageNav-${index}`}>
                <text class={item.id - 0 === CurrentNavId - 0 ? 'active' : ''} onClick={NavChange(item)}>{item.name}</text>
              </view>
            ))
          }
        </view>
      </view>
    </view>
  )
}
