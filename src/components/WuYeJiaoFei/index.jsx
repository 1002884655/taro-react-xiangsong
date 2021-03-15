import React, { useState, useEffect } from 'react'
import WuYeBanner from '@/components/WuYeBanner/index'
import ScrollPageRefresh from '@/components/ScrollPageRefresh/index'
import request, { apis } from '@/utils/request'
import nav2detail from '@/utils/nav2detail'
import { useModel } from '@/store'
import Taro from '@tarojs/taro'
import { Swiper, SwiperItem } from '@tarojs/components'
import { Checkbox, CheckboxGroup } from '@tarojs/components'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

const cancelOrder = outTradeNo => {
  return new Promise((resolve, reject) => {
    if (outTradeNo) {
      request({ ...apis.wxCancelPay, args: { outTradeNo }, params: { type: 'bill' } })
        .then(res => resolve(res))
        .catch(err => reject(err))
    } else {
      resolve()
    }
  })
}


export default function WuYeJiaoFei () {

  const { user } = useModel('user')
  const [PageList, setPageList] = useState([])
  const [BannerList, setBannerList] = useState([])
  const [checkedIds, setCheckedIds] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const [IsEmpty, setIsEmpty] = useState(false)
  const [ToReset, setToReset] = useState(false)

  useEffect(() => {
    GetBanner()
  }, [])

  const pay = idArray => {
    return new Promise((resolve, reject) => {
      // 准备下单
      request({ ...apis.wxStartPay, data: { type: 'bill', idArray } }).then(res => {
        const outTradeNo = res.outTradeNo
        // 下单
        request({ ...apis.wxUnifiedOrder, args: { outTradeNo }, params: { type: 'bill' } }).then(res => {
          Taro.requestPayment({
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.package,
            paySign: res.sign,
            signType: res.signType,
            success: resp => {
              resolve({ ...resp, orderId: outTradeNo })
            },
            fail: err => {
              cancelOrder(outTradeNo)
              reject(err)
            }
          })
        }).catch(err => {
          cancelOrder(outTradeNo)
          reject(err)
        })
      }).catch(err => reject(err))
    })
  }

  const GetBanner = (done = () => { }) => { // 获取轮播图
    request({ ...apis.getBanner, params: { showPosition: `property`, showType: 'banner', pageNum: 1, pageSize: 5 } }).then((res) => {
      setBannerList([...(res || [])])
      done()
    }).catch(() => {
      done()
    })
  }

  const Refresh = (e) => { // 下拉刷新
    if (e && e.length) {
      setIsEmpty(false)
      // 缴费中的不显示
      const list = e.filter(x => x.billStatus !== '3')
      setPageList(list)
    } else {
      setIsEmpty(true)
    }
  }

  const Push = (e) => { // 上拉加载
    setPageList(PageList.concat(e))
  }

  const handleGroupChange = e => {
    const ids = e.detail.value || []
    setCheckedIds(ids.map(x => x - 0))
  }

  const handlePay = () => {
    Taro.showModal({
      title: '提示',
      content: `确定缴费 ${totalPrice} 元?`,
      success: res => {
        if (res.confirm) {
          pay(checkedIds).then((res) => {
            Taro.showToast({
              title: '缴费成功',
              icon: 'success'
            })
            setToReset(true)
            // Taro.navigateTo({ url: `/pages/WuYe/JiaoFeiDetail/index?id=${res.orderId}` })
            // 页面刷新
            // todo
          }).catch(err => {
            Taro.showToast({
              title: (err.message || err.errMsg || err),
              icon: 'none'
            })
          })
        }
      }
    })
  }

  useEffect(() => {
    const items = checkedIds.map(x => PageList.filter(y => y.id === x)[0]).filter(Boolean)
    const total = items.reduce((acc, x) => acc + x.payPrice, 0)
    setTotalPrice(total)
  }, [checkedIds, PageList])

  return (
    <view className='WuYeJiaoFei flex-v'>
      <view className='flex-item'>
        <view>
          <ScrollPageRefresh
            IsEmpty={IsEmpty}
            ApiName={`getJiaoFeiList`}
            ListName={`list`}
            RequestUrlData={{ type: 0 }}
            RequestParams={{ taUserVerifyId: user.roomId, communityId: user.communityId }}
            Refresh={Refresh}
            Push={Push}
            Reset={ToReset}
            CloseReset={() => { setToReset(false) }}
            KeepChildren={
              <view>
                {/* 大图 */}
                <view className='BigImg'>
                  <view>
                    <WuYeBanner List={BannerList}></WuYeBanner>
                  </view>
                </view>
              </view>
            }
          >
            {/* 缴费列表 */}
            <view className='List'>
              <CheckboxGroup onChange={handleGroupChange}>
                {
                  PageList.map((item, index) => (
                    <Checkbox className='CheckBoxItem' key={`WuYeJiaoFeiItem-${index}`} value={item.id} disabled={item.billStatus !== '0'}>
                      {/* <WuYeJiaoFeiItem Data={item}></WuYeJiaoFeiItem> */}
                      <view className='flex-h'>
                        <view className='flex-item'>{item.billInvoiceExplain}</view>
                        <view className='Price'>{`${item.payPrice} 元`}</view>
                      </view>
                    </Checkbox>
                  ))
                }
              </CheckboxGroup>
            </view>
          </ScrollPageRefresh>
        </view>
      </view>
      <view className='PayLine flex-h'>
        <view>
          <text>总金额：</text>
        </view>
        <view className='flex-item'>
          <text>{totalPrice}元</text>
        </view>
        <view className='Btn'>
          <text onClick={handlePay}>支付</text>
        </view>
      </view>
    </view>
  )
}
