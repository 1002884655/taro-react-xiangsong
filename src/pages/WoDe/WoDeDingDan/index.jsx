import React, { useState } from 'react'
import PrizeChangeListItem from '@/components/PrizeChangeListItem'
import ScrollPageRefresh from '@/components/ScrollPageRefresh'
import Page from '@/layouts'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WoDeDingDan () {

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
      <view className='WoDeDingDan'>
        <ScrollPageRefresh IsEmpty={IsEmpty} ApiName={`getUserChangePrizeList`} Refresh={Refresh} Push={Push}>
          <view className='Content'>
            {
              PageList.map((item, index) => (
                <view className='ListItem' key={`PrizeItem-${index}`}>
                  <PrizeChangeListItem Data={item}></PrizeChangeListItem>
                </view>
              ))
            }
          </view>
        </ScrollPageRefresh>
      </view>
    </Page>
  )
}
