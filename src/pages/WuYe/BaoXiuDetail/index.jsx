import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import request, { apis } from '@/utils/request'
import { useModel } from '@/store'
import toolclass from '@/utils/toolclass.js'
import SlidePopup from '@/components/SlidePopup/index'
import { Textarea } from '@tarojs/components'
import Page from '@/layouts'
import { getShareObject } from '@/utils/share.js'
// import { PERSON_TYPE } from '@/utils/constants'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function BaoXiuDetail () {
  const router = useRouter()
  const { user } = useModel('user')
  const [CurrnetBaoXiuId] = useState(router.params.id)
  const [DetailInfo, setDetailInfo] = useState(null)
  const [PhoneList, setPhoneList] = useState([])
  const [ShowPopup, setShowPopup] = useState(false)
  const [ShowPingJiaPopup, setShowPingJiaPopup] = useState(false)
  const [StarIndex, setStarIndex] = useState(0)
  const [Comment, setComment] = useState(null)
  const [ReplyContent, setReplyContent] = useState(null)
  const [DataLock, setDataLock] = useState(false)
  const [ShowReplyPopup, setShowReplyPopup] = useState(false)
  const [CurrentReplyId, setCurrentReplyId] = useState(null)

  Taro.useShareAppMessage(() => {
    return getShareObject({
      title: DetailInfo.ticketTitle,
      id: CurrnetBaoXiuId,
      image: null
    }, user, router)
  })

  useEffect(() => {
    Init()
  }, [])

  useEffect(() => {
    if (CurrentReplyId !== null) {
      setReplyContent(null)
      setShowReplyPopup(true)
    }
  }, [CurrentReplyId])

  const Init = () => {
    request({ ...apis.getGongDanDetail, args: { orgId: user.orgId }, params: { ticketId: CurrnetBaoXiuId } }).then((res) => { // 获取工单详情
      setDetailInfo(res)
      request({ ...apis.getWuYePhone, params: { type: 'prop', communityId: user.communityId, taUserVerifyId: user.roomId } }).then((cRes) => { // 获取物业电话
        setPhoneList(cRes || [])
      })
    })
  }

  const SelectStar = (index) => {
    return () => {
      setStarIndex(index)
    }
  }

  const ReplyChange = (e) => {
    setReplyContent(e.detail.value)
  }

  const CommentChange = (e) => {
    setComment(e.detail.value)
  }

  const ToReply = () => {
    if (DataLock) return
    setDataLock(true)
    request({ ...apis.ReplyTicket, args: { orgId: user.orgId }, data: { ticketId: CurrnetBaoXiuId, content: ReplyContent, ticketRecordCommentId: CurrentReplyId } }).then(() => { // 获取工单详情
      Taro.showToast({ title: '回复成功', icon: 'none' })
      Init()
      setDataLock(false)
      setShowReplyPopup(false)
    }).catch((res) => {
      Taro.showToast({ title: res, icon: 'none' })
      setDataLock(false)
    })
  }

  const ToPingJia = () => {
    if (DataLock) return
    setDataLock(true)
    request({ ...apis.PostGongDanPingJia, args: { orgId: user.orgId }, params: { ticketId: CurrnetBaoXiuId }, data: { score: StarIndex - 0 + 1, comment: Comment } }).then(() => { // 获取工单详情
      Taro.showToast({ title: '评价成功', icon: 'none' })
      Init()
      setDataLock(false)
      setShowPingJiaPopup(false)
    }).catch((res) => {
      Taro.showToast({ title: res, icon: 'none' })
      setDataLock(false)
    })
  }

  const StepClick = (item) => {
    return () => {
      if (DetailInfo.status - 0 < 4) {
        setCurrentReplyId(item.id)
      }
    }
  }

  return (
    <Page>
      <view className='BaoXiuDetail'>

        <view className='TopLine'></view>

        {/* 概况 */}
        <view className='TopInfo'>
          <view className='flex-h'>
            <text className='flex-item'>{DetailInfo === null ? null : DetailInfo.ticketTitle}</text>
            {/* <text className='iconfont iconjiantouright'></text> */}
          </view>
          <view className='flex-h'>
            <text className='flex-item'>报修单号</text>
            <text>{DetailInfo === null ? null : DetailInfo.id}</text>
          </view>
          <view className='flex-h'>
            <text className='flex-item'>报修时间</text>
            <text>{DetailInfo === null ? null : toolclass.FormatDate(DetailInfo.createDate)}</text>
          </view>
        </view>

        {/* 详情 */}
        <view className='Detail'>
          <text>处理进度</text>
          <view className='flex-h'>
            <view className='Line'><view></view></view>
            <view className='flex-item'>
              <view>
                {
                  DetailInfo !== null && DetailInfo.ticketRecordList !== null &&
                  DetailInfo.ticketRecordList.map((item, index) => (
                    <view className='StepList' key={`StepList-${index}`} onClick={StepClick(item)}>
                      <view className='Title flex-h'>
                        <text className='flex-item Red'>{item.ticketStatusName}</text>
                        <text>{toolclass.FormatDate(item.createDate)}</text>
                      </view>
                      <view className='Text'>{item.content}</view>
                      {
                        item.ticketRecordCommentList.map((subItem, subIndex) => (
                          <view className='ReplyList' key={`Reply-${subIndex}`}>
                            <view className='flex-h'>
                              <view>
                                <text>{subItem.userName}</text>
                              </view>
                              <view className='flex-item'>
                                <text>回复：</text>
                              </view>
                              <view>
                                <text>{toolclass.FormatDate(subItem.createDate)}</text>
                              </view>
                            </view>
                            <view className='ReplyContent'>
                              <text>{subItem.content}</text>
                            </view>
                          </view>
                        ))
                      }
                      {/* <view className='Text'>您的报修正在分配物业处理人员，若长时间无人处理，请联系物业。<text className='Blue'>物业电话薄</text><text className='Blue iconfont iconjiantouright'></text></view> */}
                      {/* <view className='ImgList'>
                      <view></view>
                      <view></view>
                      <view></view>
                      <view></view>
                      <view></view>
                      <view></view>
                    </view> */}
                    </view>
                  ))
                }
              </view>
            </view>
          </view>

          {/* 更多操作 */}
          <view className='BottomBtn active'>
            {
              DetailInfo !== null && DetailInfo.billInvoiceId !== null &&
              <text onClick={() => { Taro.navigateTo({ url: `/pages/WuYe/BaoXiuFeiYong/index?id=${CurrnetBaoXiuId}` }) }}>费用详情</text>
            }
          </view>

          {/* 更多操作 */}
          <view className='BottomBtn active'>
            {
              DetailInfo !== null && DetailInfo.status - 0 === 4 && user && user.personId === DetailInfo.personId &&
              <text onClick={() => { setShowPingJiaPopup(true) }}>评价</text>
            }
          </view>

          {/* 更多操作 */}
          <view className='BottomBtn'>
            <text onClick={() => { setShowPopup(true) }}>与物业沟通</text>
          </view>
        </view>

        <SlidePopup Close={() => { setShowReplyPopup(false) }} Show={ShowReplyPopup}>
          <view className='ReplyPopup'>
            <Textarea placeholder='请输入您的回复' onInput={ReplyChange} value={ReplyContent}></Textarea>
            <text className='Btn' onClick={ToReply}>回复</text>
          </view>
        </SlidePopup>

        <SlidePopup Close={() => { setShowPingJiaPopup(false) }} Show={ShowPingJiaPopup}>
          <view className='PinJiaPopup'>
            <text className='Title'>请对此次服务进行评分</text>
            <view className='StarLine'>
              {
                ['', '', '', '', ''].map((item, index) => (
                  <text className={index > StarIndex ? 'iconfont iconxingxing' : 'iconfont iconxingxing active'} key={`Star-${index}`} onClick={SelectStar(index)}></text>
                ))
              }
            </view>
            <Textarea placeholder='请输入您的评价' onInput={CommentChange} value={Comment}></Textarea>
            <text className='Btn' onClick={ToPingJia}>提交</text>
          </view>
        </SlidePopup>

        <SlidePopup Close={() => { setShowPopup(false) }} Show={ShowPopup}>
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
        </SlidePopup>

      </view>
    </Page>
  )
}
