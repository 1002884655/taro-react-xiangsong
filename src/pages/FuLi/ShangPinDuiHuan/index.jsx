import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import request, { apis } from '@/utils/request'
import { Input } from '@tarojs/components'
import Page from '@/layouts'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function ShangPinDuiHuan () {

  const [CurrnetId] = useState(useRouter().params.id) // 当前id
  const [GoodsDetail, setGoodsDetail] = useState(null) // 商品详情
  const [DataLock, setDataLock] = useState(false) // 数据锁
  const [Count, setCount] = useState(1) // 商品兑换数量

  useEffect(() => {
    Init()
  }, [])

  const Init = () => {
    request({ ...apis.getGoodsDetail, args: { id: CurrnetId } }).then((res) => {
      setGoodsDetail(res)
    })
  }

  const CountChange = (e) => {
    setCount(e.detail.value)
  }

  const Submit = () => { // 兑换商品
    if (DataLock) return
    setDataLock(true)
    request({ ...apis.exchangeGoods, args: { id: CurrnetId } }).then(() => {
      Taro.showToast({ title: `兑换成功`, icon: 'none' })
      Taro.navigateTo({ url: `/pages/WoDe/WoDeDingDan/index` })
      setDataLock(false)
    }).catch((res) => {
      Taro.showToast({ title: res, icon: 'none' })
      setDataLock(false)
    })
  }

  return (
    <Page>
      <view className='ShangPinDuiHuan'>
        <view className='Info'>
          <view className='Item flex-h'>
            <view className='Img'>
              <image mode='aspectFill' src={GoodsDetail === null ? null : GoodsDetail.imgUrl} className='centerLabel'></image>
            </view>
            <view className='flex-item'>
              <text>{GoodsDetail === null ? '' : GoodsDetail.goodsName}</text>
              <view className='Num'>
                <text>{GoodsDetail === null ? '' : GoodsDetail.totalNum}</text>
                <text>人已兑换</text>
              </view>
              <view className='flex-h'>
                <text>{GoodsDetail === null ? '' : GoodsDetail.pointPrice}</text>
                <text>积分</text>
                <view className='flex-item'></view>
                <view className='EditNum flex-h'>
                  <text className='iconfont iconjian' onClick={() => { setCount(Count > 1 ? Count - 1 : 1) }}></text>
                  <Input type='number' value={Count} onInput={CountChange}></Input>
                  <text className='iconfont iconjia1' onClick={() => { setCount(Count - 0 + 1) }}></text>
                </view>
              </view>
            </view>
          </view>
          <view className='InfoBottom'></view>
        </view>
        <view className='BottomBtn'>
          <text className={DataLock ? '' : 'active'} onClick={Submit}>{DataLock ? '正在提交...' : '确认兑换'}</text>
        </view>
      </view>
    </Page>
  )
}