import React, { useState, useEffect, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { Input } from '@tarojs/components'
import PrizeListItem from '@/components/PrizeListItem/index'
import ScrollPageRefresh from '@/components/ScrollPageRefresh/index'
import { useModel } from '@/store'
import Page from '@/layouts'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

const debounce = (fn, delay) => {
  let t

  return (...args) => {
    clearTimeout(t)

    t = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export default function ShangPinFilter () {

  const { user } = useModel('user')
  const [Key, setKey] = useState('')
  const [PageList, setPageList] = useState([])
  const [SearchKey, setSearchKey] = useState('')

  const Refresh = (e) => { // 下拉刷新
    setPageList(e)
  }

  const Push = (e) => { // 上拉加载
    setPageList(PageList.concat(e))
  }

  const KeyChange = useCallback(
    debounce(e => {
      setKey(e.detail.value)
    }, 500), [])

  const SearchConfirm = () => {
    setSearchKey(Key)
  }

  useEffect(() => {
    setSearchKey(Key)
  }, [Key])

  return (
    <Page>
      <view className='ShangPinFilter flex-v'>
        <view className='Search'>
          <view className='flex-h'>
            <text className='iconfont iconsousuo'></text>
            <view className='flex-item'>
              <Input placeholder='输入关键词搜索' confirm-type='search' onInput={KeyChange} value={Key} onConfirm={SearchConfirm}></Input>
            </view>
          </view>
        </view>
        <view className='flex-item'>
          <ScrollPageRefresh SearchKey={SearchKey} RequestParams={{goodsName: SearchKey}} ApiName={`getGoodsList`} Refresh={Refresh} Push={Push}>
            <view className='PirzeList'>
              {
                PageList.map((item, index) => (
                  <view key={`PirzeListItem-${index}`}>
                    <view>
                      <PrizeListItem Data={item}></PrizeListItem>
                    </view>
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
