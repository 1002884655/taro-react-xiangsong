import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import Page from '@/layouts'
import request, { apis } from '@/utils/request'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WuYeBaoXiuQuYu () {
  const [TypeList, setTypeList] = useState([])

  const handleClick = item => {
    Taro.redirectTo({ url: `/pages/WuYe/TianJiaBaoXiu/index?type=${item.typeId}` })
  }
  
  useEffect(() => {
    request({...apis.getRepairTypeList, params: {pageSize: 999}}).then(res => {
      setTypeList(res.records)
    })
  }, [])

  return (
    <Page>
      <view className='WuYeBaoXiuQuYu'>
        <view className='AdvContent'>
          <view>
            <image mode='aspectFill' src='https://zhiyun-image.oss-cn-shanghai.aliyuncs.com/xiangsong/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201223144943.png' className='centerLabel'></image>
          </view>
        </view>
        {
          TypeList.map((item, index) => (
            <view key={`WuYeBaoXiuQuYu-${index}`}>
              <view onClick={() => handleClick(item)}>
                <view>
                  {
                    item.icon && <image mode="aspectFit" src={item.icon} style={{width: '32rpx', height: '32rpx', verticalAlign: 'middle', marginRight: '16rpx'}} />
                  }
                  <text>{item.typeName}</text>
                </view>
                <text>{item.desc}</text>
              </view>
            </view>
          ))
        }
      </view>
    </Page>
  )
}
