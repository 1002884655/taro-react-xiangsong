import React, { useState, useEffect } from 'react'
import Page from '@/layouts'
import Taro from '@tarojs/taro'
import request, { apis } from '@/utils/request'
// import { Input } from '@tarojs/components'
import { useModel } from '@/store'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function GongGongFuWu () {

  const { user } = useModel('user')
  const [PageList, setPageList] = useState([])

  useEffect(() => {
    request({ ...apis.getWuYePhone, params: { type: 'common', communityId: user.communityId, taUserVerifyId: user.roomId } }).then((res) => { // 获取公共电话
      setPageList(res || [])
    })
  }, [])

  return (
    <Page>
      <view className='GongGongFuWu'>
        <view className='GongGongFuWuContent'>
          {
            PageList.map((item, index) => (
              <view className='ListItem flex-h' key={`FuWuItem-${index}`} onClick={() => { Taro.makePhoneCall({ phoneNumber: item.tel }) }}>
                <view className='flex-item'>
                  <text>{item.name}</text>
                  <text>{item.tel}</text>
                </view>
                <text className='iconfont iconjiantouright'></text>
              </view>
            ))
          }
        </view>
      </view>
    </Page>
  )
}
