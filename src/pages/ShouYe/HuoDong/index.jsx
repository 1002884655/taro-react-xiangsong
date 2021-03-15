import React, { useState } from 'react'
import ActivityListItem from '@/components/ActivityListItem/index'
import ScrollPageRefresh from '@/components/ScrollPageRefresh/index'
import Page from '@/layouts'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function ShouYeHuoDong () {

  const [PageList, setPageList] = useState([])
  const [IsEmpty, setIsEmpty] = useState(false)

  const Refresh = (e) => { // 下拉刷新
    if (e.length > 0) {
      setIsEmpty(false)
      setPageList(e)
    } else {
      setIsEmpty(true)
    }
  }

  const Push = (e) => { // 上拉加载
    setPageList(PageList.concat(e))
  }

  return (
    <Page>
      <view className='ShouYeHuoDong'>
        <ScrollPageRefresh IsEmpty={IsEmpty} ApiName={`getActivityList`} ListName={`list`} Refresh={Refresh} Push={Push}>
          <view className='ShouYeHuoDongContent'>
            {
              PageList.map((item, index) => (
                <view className='ListItem' key={`ActivityItem-${index}`}>
                  <ActivityListItem Data={item}></ActivityListItem>
                </view>
              ))
            }
          </view>
        </ScrollPageRefresh>
      </view>
    </Page>
  )
}
