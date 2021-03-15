import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import request, { apis } from '@/utils/request'
import { RichText } from '@tarojs/components'
import { useModel } from '@/store'
import Page from '@/layouts'
import { getShareObject } from '@/utils/share.js'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function ShangPinXiangQing () {
  const router = useRouter()
  const { user } = useModel('user')
  const [CurrnetId] = useState(router.params.id) // 当前id
  const [GoodsDetail, setGoodsDetail] = useState(null) // 商品详情

  Taro.useShareAppMessage(() => {
    return getShareObject({
      title: GoodsDetail.goodsName,
      id: CurrnetId,
      image: GoodsDetail.imgUrl
    }, user, router)
  })

  useEffect(() => {
    Init()
  }, [])

  const Init = () => {
    request({ ...apis.getGoodsDetail, args: { id: CurrnetId } }).then((res) => {
      setGoodsDetail(res)
    })
  }

  return (
    <Page>
      <view className='ShangPinXiangQing'>
        <view className='Info'>
          <view className='Img'>
            <image mode='aspectFit' src={GoodsDetail === null ? null : GoodsDetail.detailImgUrl}></image>
          </view>
          <view className='Title'>
            <text>{GoodsDetail === null ? '' : GoodsDetail.goodsName}</text>
          </view>
          <view className='flex-h'>
            <text>{GoodsDetail === null ? '' : GoodsDetail.pointPrice}</text>
            <text className='flex-item'>积分</text>
            <text>剩余数量</text>
            <text>{GoodsDetail === null ? '' : GoodsDetail.inventory}</text>
          </view>
        </view>
        <view className='Detail'>
          <view className='Title'>
            <view className='Line'></view>
            <text>产品详情</text>
          </view>
          <RichText nodes={GoodsDetail !== null ? GoodsDetail.goodsDescription : null}></RichText>
          {/* <image mode='aspectFit' src={GoodsDetail === null ? null : GoodsDetail.detailImgUrl} style={{ width: `100%` }}></image> */}
          <text className='Tips'>免责申明：本站商品信息均来自于合作方，其真实性、准确性和合法性由信息拥有者（合作方）负责。本站不提供任何保证，并不承担任何法律责任</text>
          <view className='BottomBtn'>
            <text className='active' onClick={() => { Taro.navigateTo({ url: `/pages/FuLi/ShangPinDuiHuan/index?id=${CurrnetId}` }) }}>立即兑换</text>
          </view>
        </view>
      </view>
    </Page>
  )
}
