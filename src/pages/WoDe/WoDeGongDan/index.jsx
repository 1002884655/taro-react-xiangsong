import React, { useState } from 'react'
import ScrollPageRefresh from '@/components/ScrollPageRefresh'
import WuYeBaoXiuItem from '@/components/WuYeBaoXiuItem'
import { useModel } from '@/store'
import Page from '@/layouts'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WoDeGongDan () {

  const { user } = useModel('user')
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
      <view className='WoDeGongDan'>
      <ScrollPageRefresh IsEmpty={IsEmpty} ApiName={`getGongDanList`} RequestUrlData={{ orgId: user.orgId }} RequestParams={{ type: 2, taUserVerifyId: user.roomId }}  ListName='pagelist' Refresh={Refresh} Push={Push}>
          <view className='Content Activity'>
            {
              PageList.map((item, index) => (
                <view className='ListItem' key={`ActivityItem-${index}`}>
                  <WuYeBaoXiuItem Data={item}></WuYeBaoXiuItem>
                </view>
              ))
            }
          </view>
        </ScrollPageRefresh>
      </view>
    </Page>
  )
}
