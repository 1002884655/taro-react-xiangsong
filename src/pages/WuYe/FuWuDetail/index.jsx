import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { RichText } from '@tarojs/components'
import request, { apis } from '@/utils/request'
import toolclass from '@/utils/toolclass.js'
import Page from '@/layouts'
import { useModel } from '@/store'
import { getShareObject } from '@/utils/share.js'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WuYeFuWuDetail () {
  const router = useRouter()
  const { user } = useModel('user')
  const [CurrnetId] = useState(router.params.id) // 当前id
  const [DetailInfo, setDetailInfo] = useState(null) // 详情

  Taro.useShareAppMessage(() => {
    return getShareObject({
      title: DetailInfo.newsName,
      id: CurrnetId,
      image: DetailInfo.newsImg
    }, user, router)
  })

  useEffect(() => {
    GetDetail()
  }, [CurrnetId])

  const GetDetail = () => { // 获取详情
    request({ ...apis.getWuYeFuWuDetail, args: { id: CurrnetId } }).then((res) => {
      setDetailInfo(res)
    })
  }

  return (
    <Page>
      <view className='WuYeFuWuDetail'>
        {
          DetailInfo !== null &&
          <view>
            <view className='Title'>
              <text>{DetailInfo.newsName}</text>
            </view>
            <view className='flex-h'>
              <text className='flex-item'>{toolclass.FormatDate(DetailInfo.createDate)}</text>
              <text className='iconfont iconguankan'></text>
              <text>{DetailInfo.pvNum || 0}</text>
            </view>
            <RichText nodes={DetailInfo.newsDetail}></RichText>
          </view>
        }
      </view>
    </Page>
  )
}
