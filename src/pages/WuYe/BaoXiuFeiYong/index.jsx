import React, { useState } from 'react'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import SlidePopup from '@/components/SlidePopup/index'
import UploadImg from '@/components/UploadImg/index'
import Page from '@/layouts'
import request, { apis } from '@/utils/request'
import { useModel } from '@/store'
import toolclass from '@/utils/toolclass.js'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function BaoXiuFeiYong () {
  const router = useRouter()

  const { user } = useModel('user')
  const [ShowPopup, setShowPopup] = useState(false)
  const [PopupType, setPopupType] = useState(0)
  const [CurrnetBaoXiuId] = useState(router.params.id)
  const [DetailInfo, setDetailInfo] = useState(null)
  const [BillInfo, setBillInfo] = useState(null)

  useDidShow(() => {
    Init()
  })

  const Init = () => {
    request({ ...apis.getGongDanDetail, args: { orgId: user.orgId }, params: { ticketId: CurrnetBaoXiuId } }).then((res) => { // 获取工单详情
      setDetailInfo(res)
      request({ ...apis.getBillInvoiced, args: { orgId: user.orgId, id: res.billInvoiceId } }).then((cRes) => { // 获取费用详情
        setBillInfo(cRes)
      })
    })
  }

  const SlidePopupClose = () => {
    setShowPopup(false)
  }

  const CancelOrder = (outTradeNo) => {
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

  const WechatPay = (idArray) => {
    return new Promise((resolve, reject) => {
      // 准备下单
      request({ ...apis.wxStartPay, data: { type: 'bill', idArray } }).then((res) => {
        const outTradeNo = res.outTradeNo
        // 下单
        request({ ...apis.wxUnifiedOrder, args: { outTradeNo }, params: { type: 'bill' } }).then((res) => {
          Taro.requestPayment({
            timeStamp: res.timeStamp,
            nonceStr: res.nonceStr,
            package: res.package,
            paySign: res.sign,
            signType: res.signType,
            success: resp => {
              resolve(resp)
            },
            fail: err => {
              CancelOrder(outTradeNo)
              reject(err)
            }
          })
        }).catch(err => {
          CancelOrder(outTradeNo)
          reject(err)
        })
      }).catch(err => reject(err))
    })
  }

  const ToPay = () => {
    Taro.showModal({
      title: '提示',
      content: `确定缴费 ${BillInfo.payPrice} 元?`,
      success: res => {
        if (res.confirm) {
          WechatPay([BillInfo.id - 0]).then(() => {
            setShowPopup(false)
            Taro.showToast({
              title: '缴费成功',
              icon: 'success'
            })
            setBillInfo({ ...BillInfo, billStatus: 1 })
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

  return (
    <Page>
      <view className='BaoXiuFeiYong'>

        {/* 费用信息 */}
        <view className='Info'>
          <view>
            <text>{DetailInfo === null ? '' : DetailInfo.ticketTitle}</text>
            <view className='flex-h'>
              <text className='flex-item'>报修类型</text>
              <text>{DetailInfo === null ? '' : DetailInfo.repairName}问题</text>
            </view>
            <view className='flex-h'>
              <text className='flex-item'>报修单号</text>
              <text>{DetailInfo === null ? '' : DetailInfo.id}</text>
            </view>
            <view className='flex-h'>
              <text className='flex-item'>报修时间</text>
              <text>{DetailInfo === null ? '' : toolclass.FormatDate(DetailInfo.createDate)}</text>
            </view>
            <view className='flex-h'>
              <text className='flex-item'>报修进度</text>
              <text>{DetailInfo === null ? '' : DetailInfo.ticketRecordList[DetailInfo.ticketRecordList.length - 1].ticketStatusName}</text>
            </view>
            <view className='flex-h'>
              <text className='flex-item'>处理人</text>
              <text>{DetailInfo === null ? '' : DetailInfo.ticketRecordList[DetailInfo.ticketRecordList.length - 1].createUser || '-'}</text>
            </view>
            <view className='flex-h'>
              <text className='flex-item'>报修费用</text>
              <text className='Red'>￥{BillInfo === null ? '' : BillInfo.payPrice}</text>
            </view>
          </view>
          <view className='InfoBottom'></view>
        </view>

        <view className='BottomBtn'>
          {
            BillInfo !== null &&
            <text className={BillInfo.billStatus - 0 === 0 ? 'active' : ''} onClick={() => { if (BillInfo.billStatus - 0 === 0) { setPopupType(1); setShowPopup(true) } }}>{BillInfo.billStatus - 0 === 0 ? '我要缴费' : '已缴费'}</text>
          }
          {/* <text onClick={() => { setPopupType(2); setShowPopup(true) }}>线下缴费</text> */}
        </view>

        {/* 弹窗 */}
        <SlidePopup Close={SlidePopupClose} Show={ShowPopup}>

          {/* 线上缴费 */}
          {
            PopupType - 0 === 1 &&
            <view className='JiaoFeiPopup XianShang'>
              <view className='Price'>立即支付<text>{BillInfo === null ? '' : BillInfo.payPrice}</text>元</view>
              <view className='flex-h'>
                <text className='iconfont iconweixinzhifu'></text>
                <text className='flex-item'>微信支付</text>
                <text className='iconfont icongou'></text>
              </view>
              <view className='Btn'>
                <text onClick={ToPay}>去付款</text>
              </view>
            </view>
          }

          {/* 线下缴费 */}
          {
            PopupType - 0 === 2 &&
            <view className='JiaoFeiPopup XianXia'>
              <text>上传线下支付凭证</text>
              <view className='UploadContainer'>
                <UploadImg></UploadImg>
              </view>
            </view>
          }

        </SlidePopup>

      </view>
    </Page>
  )
}
