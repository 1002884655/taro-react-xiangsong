import React, { useState } from 'react'
import NewsListItem from '@/components/NewsListItem/index'
import ScrollPageRefresh from '@/components/ScrollPageRefresh/index'
import Page from '@/layouts'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function ShouYeZiXun () {

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
      <view className='ShouYeZiXun'>
        <ScrollPageRefresh IsEmpty={IsEmpty} ApiName={`getNewsList`} Refresh={Refresh} Push={Push}>
          <view className='ShouYeHuoDongContent'>
            {
              PageList.map((item, index) => (
                <view className='ListItem' key={`ActivityItem-${index}`}>
                  <NewsListItem Data={item} ShowTips={index === 0}></NewsListItem>
                </view>
              ))
            }
          </view>
        </ScrollPageRefresh>
      </view>
    </Page>
  )
}
