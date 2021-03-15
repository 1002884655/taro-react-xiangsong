import React, { useState } from 'react'
import ScrollPageRefresh from '@/components/ScrollPageRefresh'
import WuYeJiaoFeiItem from '@/components/WuYeJiaoFeiItem'
import Page from '@/layouts'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WoDeJiaoFei () {

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
      <view className='WoDeJiaoFei'>
        <ScrollPageRefresh IsEmpty={IsEmpty} ApiName={`getJiaoFeiList`} ListName={`list`} RequestUrlData={{ type: 1 }} Refresh={Refresh} Push={Push}>
          <view className='Content Activity'>
            {
              PageList.map((item, index) => (
                <view className='ListItem' key={`ActivityItem-${index}`}>
                  <WuYeJiaoFeiItem Data={item}></WuYeJiaoFeiItem>
                </view>
              ))
            }
          </view>
        </ScrollPageRefresh>
      </view>
    </Page>
  )
}
