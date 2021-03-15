import React, { useState, useEffect } from 'react'
import WuYeFuWuListItem from '@/components/WuYeFuWuListItem'
import ScrollPageRefresh from '@/components/ScrollPageRefresh'
import Page from '@/layouts'
import Taro, { useRouter } from '@tarojs/taro'
// import { Input } from '@tarojs/components'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function FuWuList () {

  const [PageList, setPageList] = useState([])
  const [IsEmpty, setIsEmpty] = useState(false)
  const [PageTitle] = useState(useRouter().params.name)
  const [PageType] = useState(useRouter().params.type)

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: PageTitle })
  }, [PageTitle])

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
      <view className='FuWuList flex-v'>
        {/* <view className='Search'>
          <view className='flex-h'>
            <text className='iconfont iconsousuo'></text>
            <view className='flex-item'>
              <Input placeholder='输入关键词搜索' confirm-type='search' value={Key} onConfirm={SearchConfirm}></Input>
            </view>
          </view>
        </view> */}
        <view className='flex-item'>
          <ScrollPageRefresh IsEmpty={IsEmpty} ApiName='getWuYeFuWuList' RequestParams={{ newsTypeId: PageType }} Refresh={Refresh} Push={Push}>
            <view className='FuWuListContent'>
              {
                PageList.map((item, index) => (
                  <view className='ListItem' key={`FuWuItem-${index}`}>
                    <WuYeFuWuListItem Data={item}></WuYeFuWuListItem>
                  </view>
                ))
              }
            </view>
          </ScrollPageRefresh>
        </view>
      </view>
    </Page>
  )
}
