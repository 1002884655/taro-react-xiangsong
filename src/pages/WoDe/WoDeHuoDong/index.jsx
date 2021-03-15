import React, { useState } from 'react'
import ActivityListItem from '@/components/ActivityListItem/index'
import ScrollPageRefresh from '@/components/ScrollPageRefresh/index'
import Page from '@/layouts'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WoDeHuoDong (props) {

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
      <view className='WoDeHuoDong'>
        <ScrollPageRefresh IsEmpty={IsEmpty} ApiName={`getActivityList`} RequestParams={{ mine: 1 }} Refresh={Refresh} Push={Push}>
          <view className='Content Activity'>
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
