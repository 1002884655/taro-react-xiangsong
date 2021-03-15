import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import request, { apis } from '@/utils/request'
import { RichText, WebView } from '@tarojs/components'
import toolclass from '@/utils/toolclass.js'
import Page from '@/layouts'
import { useModel } from '@/store'
import { getShareObject } from '@/utils/share.js'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function ZiXunDetail () {

  const { user } = useModel('user')
  const router = useRouter()
  const [CurrnetZiXunId] = useState(router.params.id) // 当前查询资讯id
  const [NewsDetail, setNewsDetail] = useState(null) // 资讯详情

  Taro.useShareAppMessage(() => {
    return getShareObject({
      title: NewsDetail.newsName,
      id: CurrnetZiXunId,
      image: NewsDetail.newsImg
    }, user, router)
  })

  useEffect(() => {
    GetNewsDetail()
  }, [CurrnetZiXunId])

  const GetNewsDetail = () => { // 获取资讯详情
    request({ ...apis.getNewsDetail, args: { id: CurrnetZiXunId } }).then((res) => {
      setNewsDetail(res)
      AddNewsViews()
    })
  }

  const AddNewsViews = () => { // 资讯阅读量+1
    request({ ...apis.addNewsViews, args: { id: CurrnetZiXunId } })
  }

  return (
    <Page>
      <view className='ZiXunDetail'>
        {
          NewsDetail !== null &&
          <view>
            <view className='Title'>
              <text>{NewsDetail.newsName}</text>
            </view>
            <view className='flex-h'>
              <text className='flex-item'>{toolclass.FormatDate(NewsDetail.createDate)}</text>
              <text className='iconfont iconguankan'></text>
              <text>{NewsDetail.pvNum || 0}</text>
            </view>
            {
              NewsDetail.newsDetailType - 0 === 1 &&
              <RichText nodes={NewsDetail.newsDetail}></RichText>
            }
            {
              NewsDetail.newsDetailType - 0 !== 1 &&
              <WebView src={NewsDetail.newsDetail}></WebView>
            }
          </view>
        }
      </view>
    </Page>
  )
}
