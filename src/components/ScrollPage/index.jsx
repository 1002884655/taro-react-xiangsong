import React, { useState } from 'react'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function ScrollPage (props) {

  const { KeepChildren = null, IsEmpty = false, IsPullDown = false, ListRefresh = true, IsPullUp = false, HasMore = true, OnRefresh = () => { }, OnPullUp = () => { }, RefreshBg = 'none' } = props

  return (
    <view className='ScrollPage'>
      <scroll-view scroll-y='true' style='height: 100%;' refresher-enabled={true} onrefresherrefresh={OnRefresh} onscrolltolower={OnPullUp} refresher-triggered={IsPullDown} refresher-background={RefreshBg}>
        <view className='ScrollPageContent'>
          {
            KeepChildren
          }
          {
            !IsEmpty &&
            props.children
          }
          {
            IsEmpty &&
            <view className='NoData'>
              <text className='iconfont iconzanwushuju'></text>
              <text>暂无数据</text>
            </view>
          }
          <view className='ScrollPageBottom'></view>
        </view>
        {
          !IsEmpty && ListRefresh &&
          <text className='LoadMoreText'>{IsPullUp ? '正在加载更多...' : HasMore ? '上拉加载更多' : '已经到底了~'}</text>
        }
      </scroll-view>
    </view>
  )
}
