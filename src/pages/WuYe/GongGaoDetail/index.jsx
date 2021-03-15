import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import request, { apis } from '@/utils/request'
import { RichText } from '@tarojs/components'
import { useModel } from '@/store'
import toolclass from '@/utils/toolclass.js'
import Page from '@/layouts'
import { getShareObject } from '@/utils/share.js'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WuYeGongGaoDetail () {
  const router = useRouter()
  const { user } = useModel('user')
  const [CurrnetId] = useState(useRouter().params.id)
  const [DetailInfo, setDetailInfo] = useState(null)

  Taro.useShareAppMessage(() => {
    return getShareObject({
      title: DetailInfo.announcementTitle,
      id: CurrnetId,
      image: DetailInfo.announcementCarouselImg
    }, user, router)
  })

  useEffect(() => {
    Init()
  }, [CurrnetId])

  const Init = () => {
    request({ ...apis.getGongGaoDetail, args: { orgId: user.orgId }, params: { id: CurrnetId } }).then((res) => {
      setDetailInfo(res)
    })
  }

  return (
    <Page>
      <view className='WuYeGongGaoDetail'>
        <view className='Title'>
          <text>{DetailInfo === null ? null : DetailInfo.announcementTitle}</text>
        </view>
        <view className='flex-h'>
          <view className='flex-item'>
            <text>{DetailInfo === null ? null : DetailInfo.createUser}</text>
            <text>{DetailInfo === null ? null : toolclass.FormatDate(DetailInfo.createDate)}</text>
          </view>
          <view>
            <text className='iconfont iconguankan'></text>
            <text>{DetailInfo === null ? null : DetailInfo.viewCount}</text>
          </view>
        </view>
        <view className='Desc'>
          <RichText nodes={DetailInfo === null ? null : DetailInfo.announcementContent}></RichText>
          <image mode='widthFix' src={DetailInfo === null ? null : DetailInfo.announcementCarouselImg}></image>
        </view>
      </view>
    </Page>
  )
}
