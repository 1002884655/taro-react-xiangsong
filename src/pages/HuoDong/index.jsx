import React, { useState } from 'react'
import TabPageCutNav from '@/components/TabPageCutNav/index'
import NavHeader from '@/components/NavHeader/index'
import ActivityListItem from '@/components/ActivityListItem/index'
import NewsListItem from '@/components/NewsListItem/index'
import ScrollPageRefresh from '@/components/ScrollPageRefresh/index'
import Page from '@/layouts'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function HuoDong () {

  const [NavList] = useState([{ name: '活动', id: 1 }, { name: '资讯', id: 2 }])
  const [CurrentNavId, setCurrentNavId] = useState(1)
  const [ActivityList, setActivityList] = useState([])
  const [NewsList, setNewsList] = useState([])
  const [IsEmpty, setIsEmpty] = useState(false)

  const Refresh = (e) => { // 下拉刷新
    if (e.length > 0) {
      setIsEmpty(false)
      if (CurrentNavId === 1) {
        setActivityList(e)
      } else {
        setNewsList(e)
      }
    } else {
      setIsEmpty(true)
    }
  }

  const Push = (e) => { // 上拉加载
    if (CurrentNavId === 1) {
      setActivityList(ActivityList.concat(e))
    } else {
      setNewsList(NewsList.concat(e))
    }
  }

  const NavChange = (e) => { // nav切换
    return () => {
      setCurrentNavId(e.id)
    }
  }

  return (
    <Page>
      <view className='HuoDong flex-v'>
        <NavHeader BgColor='none' Title='活动' IsFixed={true}></NavHeader>
        <TabPageCutNav List={NavList} CurrentNavId={CurrentNavId} NavChange={NavChange}></TabPageCutNav>
        <view className='flex-item'>
          <view>
            {/* 活动 */}
            {
              CurrentNavId - 0 === 1 &&
              <ScrollPageRefresh IsEmpty={IsEmpty} ApiName={`getActivityList`} ListName={`list`} Refresh={Refresh} Push={Push}>
                <view className='Content Activity'>
                  {
                    ActivityList.map((item, index) => (
                      <view className='ListItem' key={`ActivityItem-${index}`}>
                        <ActivityListItem Data={item}></ActivityListItem>
                      </view>
                    ))
                  }
                </view>
              </ScrollPageRefresh>
            }

            {/* 资讯 */}
            {
              CurrentNavId - 0 === 2 &&
              <ScrollPageRefresh IsEmpty={IsEmpty} ApiName={`getNewsList`} Refresh={Refresh} Push={Push}>
                <view className='Content News'>
                  {/* <view className='BigImg'>
                    <image mode='aspectFill' src={null} class='centerLabel'></image>
                  </view> */}
                  <view className='List'>
                    {
                      NewsList.map((item, index) => (
                        <view className='ListItem' key={`NewsItem-${index}`}>
                          <NewsListItem Data={item} ShowTips={index === 0}></NewsListItem>
                        </view>
                      ))
                    }
                  </view>
                </view>
              </ScrollPageRefresh>
            }
          </view>
        </view>
      </view>
    </Page>
  )
}
