import React, { useState, useEffect, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import request, { apis } from '@/utils/request'
import SlidePopup from '@/components/SlidePopup/index'
import Page from '@/layouts'
import { useModel } from '@/store'
import toolclass from '@/utils/toolclass.js'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function JiaoFeiDetail () {
  const { user } = useModel('user')
  const [bill, setBill] = useState(null)
  const [ShowPopup, setShowPopup] = useState(false)

  const [PopupType, setPopupType] = useState(0)
  const [PhoneList, setPhoneList] = useState([])

  const { id } = useRouter().params
  const paying = useRef(false)
  const order = useRef()

  const handleReadyPay = () => {
    setPopupType(1)
    setShowPopup(true)
  }

  const cancelOrder = () => {
    if (order.current && order.current.outTradeNo) {
      request({ ...apis.wxCancelPay, args: { outTradeNo: order.current.outTradeNo }, params: { type: 'bill' } }).then(() => {
        order.current = undefined
      }).catch(er => {
        Taro.showToast({
          title: er,
          icon: 'none'
        })
      })
    }
  }

  const handleCancelOrder = () => {
    cancelOrder()
    setShowPopup(false)
    setPopupType(0)
  }

  const handlePaying = () => {
    // 防止重复提交
    if (paying.current) {
      return
    }

    paying.current = true

    // 准备下单
    request({ ...apis.wxStartPay, data: { type: 'bill', idArray: [id].map(x => x - 0) } }).then(res => {
      order.current = res
      const outTradeNo = res.outTradeNo
      // 下单
      request({ ...apis.wxUnifiedOrder, args: { outTradeNo }, params: { type: 'bill' } }).then(() => {
        Taro.requestPayment({
          timeStamp: `${res.timeStamp}`,
          nonceStr: res.nonceStr,
          package: res.package,
          paySign: res.sign,
          signType: res.signType,
          success: () => {
            paying.current = false
            order.current = undefined
            setShowPopup(false)
            setPopupType(0)
            Taro.showToast({
              title: '支付成功',
              icon: 'success'
            })
          },
          fail: err => {
            console.error('支付失败', err)
            cancelOrder()
            paying.current = false
            Taro.showToast({
              title: err.message || err.errMsg || err,
              icon: 'none'
            })
          }
        })
      }).catch(er => {
        cancelOrder()
        paying.current = false
        Taro.showToast({
          title: er,
          icon: 'none'
        })
      })
    }).catch(er => {
      paying.current = false
      Taro.showToast({
        title: er,
        icon: 'none'
      })
    })
  }

  const Init = () => {
    request({ ...apis.getWuYePhone, params: { type: 'prop', communityId: user.communityId, taUserVerifyId: user.roomId } }).then((res) => { // 获取物业电话
      setPhoneList(res || [])
    })
  }

  useEffect(() => {
    if (user && id) {
      request({ ...apis.getBillInvoiced, args: { orgId: 1, id } }).then(res => {
        if (res) {
          setBill(res)
        }
      })
      Init()
    }
  }, [user, id])

  return (
    <Page>
      <view className='JiaoFeiDetail'>
        {
          bill !== null &&
          <view className='DetailContainer'>
            <view className='Info'>
              <view className='flex-h'>
                <text className='flex-item'>{bill.billName}</text>
                <text>{toolclass.FormatDate(bill.endDate)}截止</text>
              </view>
              <view className='Detail'>
                <view className='Title flex-h'>
                  <text className='flex-item'>缴费金额</text>
                  <text className='Num'>{bill.payPrice}</text>
                  <text>元</text>
                </view>
                <text>{bill.billExplain}</text>
                {/* <view className='Line flex-h'>
                  <text>垃圾费：</text>
                  <text className='flex-item'>100元</text>
                </view>
                <view className='Line flex-h'>
                  <text>绿地维护费：</text>
                  <text className='flex-item'>100元</text>
                </view>
                <view className='Line flex-h'>
                  <text>公摊电费：</text>
                  <text className='flex-item'>100元</text>
                </view> */}
              </view>
            </view>
            <view className='Detail'>
              <view className='flex-h'>
                <text>订单编号</text>
                <text className='flex-item'>{bill.id}</text>
              </view>
              <view className='flex-h'>
                <text>订单类型</text>
                <text className='flex-item'>{bill.isTicket ? '维修费' : '物业费'}</text>
              </view>
              <view className='flex-h'>
                <text>下单时间</text>
                <text className='flex-item'>{toolclass.FormatDate(bill.createTime)}</text>
              </view>
              <view className='flex-h'>
                <text>缴费时间</text>
                <text className='flex-item'>{toolclass.FormatDate(bill.payDate)}</text>
              </view>
              <view className='flex-h'>
                <text>缴费方式</text>
                <text className='flex-item'>{bill.payType - 0 === 0 ? '微信支付' : bill.payType - 0 === 1 ? '线下支付' : '支付宝支付'}</text>
              </view>
              <view className='flex-h'>
                <text>交易流水</text>
                <text className='flex-item'>{bill.outTradeNo}</text>
              </view>
              <view className='flex-h'>
                <text>缴费备注</text>
                <text className='flex-item'>{bill.billExplain}</text>
              </view>
            </view>
            <view className='InfoBottom'></view>
          </view>
        }
        <view className='BottomContainer'>
          <text onClick={() => { setPopupType(2); setShowPopup(true) }}>对费用有疑问？</text>
          {
            bill !== null && bill.billStatus - 0 !== 1 &&
            <text onClick={handleReadyPay}>立即缴费</text>
          }
        </view>
        {/* 弹窗 */}
        <SlidePopup Close={handleCancelOrder} Show={ShowPopup}>
          {
            PopupType - 0 === 1 &&
            <view className='JiaoFeiPopup'>
              <view className='Price'>立即支付<text>{bill.payPrice}</text>元</view>
              <view className='flex-h'>
                <text className='iconfont iconweixinzhifu'></text>
                <text className='flex-item'>微信支付</text>
                <text className='iconfont icongou'></text>
              </view>
              <view className='Btn' onClick={handlePaying}>
                <text>去付款</text>
              </view>
            </view>
          }
          {
            PopupType - 0 === 2 &&
            <view className='LianXiPopup'>
              <text>联系物业</text>
              <text>对此费用有疑问</text>
              {
                PhoneList.map((item, index) => (
                  <view className='flex-h' key={`PhoneList-${index}`} onClick={() => { Taro.makePhoneCall({ phoneNumber: item.tel }) }}>
                    <text className='flex-item'>{item.name}</text>
                    <text>{item.tel}</text>
                    <text className='iconfont icondianhua'></text>
                  </view>
                ))
              }
            </view>
          }
        </SlidePopup>
      </view>
    </Page>
  )
}
