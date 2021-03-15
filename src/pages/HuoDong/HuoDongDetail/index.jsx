import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { RichText, Input } from '@tarojs/components'
import request, { apis } from '@/utils/request'
import { useModel } from '@/store'
import Page from '@/layouts'
import toolclass from '@/utils/toolclass.js'
import { getShareObject } from '@/utils/share.js'
import GetUserPhone from '@/components/GetUserPhone/index'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function HuoDongDetail () {

  const { user } = useModel('user')
  const router = useRouter()
  const [DataLock, setDataLock] = useState(false)
  // const [HasJoin, setHasJoin] = useState(null)
  // const [HasSign, setHasSign] = useState(null)
  // const [CanJoin, setCanJoin] = useState(null)
  // const [JoinBtnText, setJoinBtnText] = useState(null)
  // const [JoinBtnStatus, setJoinBtnStatus] = useState(false)
  const [ShowJoinNumPopup, setShowJoinNumPopup] = useState(false)
  const [JoinNum, setJoinNum] = useState(null)
  const [ShowGetUserPhoneLayer, setShowGetUserPhoneLayer] = useState(false)
  const [CurrnetHuoDongId] = useState(router.params.id) // 当前活动id
  const [ActivityDetail, setActivityDetail] = useState(null) // 活动详情
  const [JoinInfo, setJoinInfo] = useState(null) // 参加活动详情
  const [Status, setStatus] = useState(null) // 参加活动状态 0-立即参与 1-未开始 2-去报名 3-已报名 4-去签到 5-已签到 6-已结束
  const [StatusText, setStatusText] = useState(null) // 参加活动状态 0-立即参与 1-未开始 2-去报名 3-已报名 4-去签到 5-已签到 6-已结束

  Taro.useShareAppMessage(() => {
    return getShareObject({
      title: ActivityDetail.title,
      id: CurrnetHuoDongId,
      image: ActivityDetail.imgUrl
    }, user, router)
  })

  useEffect(() => {
    GetActivityDetail() // 获取活动详情
  }, [CurrnetHuoDongId])

  useEffect(() => {
    if (ActivityDetail !== null) {
      CheckActivityJoin() // 查询活动参加详情
    }
  }, [ActivityDetail])

  useEffect(() => {
    if (JoinInfo !== null) {
      ToGetActivityStatus() // 计算参加活动状态
    }
  }, [JoinInfo])

  useEffect(() => {
    if (Status !== null) {
      CalcStatusText()
    }
  }, [Status])

  const GetActivityDetail = () => { // 获取活动详情
    request({ ...apis.getActivityDetail, args: { id: CurrnetHuoDongId } }).then((res) => {
      setActivityDetail(res)
    })
  }

  const CheckActivityJoin = () => { // 查询活动参加详情
    request({ ...apis.checkActivityJoin, args: { id: CurrnetHuoDongId } }).then((res) => {
      setJoinInfo(res)
    })
  }

  const ToGetActivityStatus = () => { // 计算参加活动状态
    if (ActivityDetail.activityStatus - 0 === 0) { // 进行中
      if (JoinInfo.dynamic.isSign - 0 === 1) { // 已报名
        if (JoinInfo.enlist.isCheckin - 0 === 1) { // 已签到
          setStatus(5)
        } else { // 未签到
          setStatus(4)
        }
      } else { // 未报名
        setStatus(2)
      }
    } else if (ActivityDetail.activityStatus - 0 === 1) { // 未开始
      if (JoinInfo.dynamic.isSign - 0 === 1) { // 已报名
        setStatus(3)
      } else { // 未报名
        setStatus(2)
      }
    } else { // 已结束
      setStatus(6)
    }
  }

  const CalcStatusText = () => { // 参加活动状态 1-未开始 2-去报名 3-已报名 4-去签到 5-已签到 6-已结束
    if (Status - 0 === 1) {
      setStatusText('未开始')
    } else if (Status - 0 === 2) {
      setStatusText('去报名')
    } else if (Status - 0 === 3) {
      setStatusText('已报名')
    } else if (Status - 0 === 4) {
      setStatusText('去签到')
    } else if (Status - 0 === 5) {
      setStatusText('已签到')
    } else if (Status - 0 === 6) {
      setStatusText('已结束')
    }
  }

  const ConfirmToJoin = () => {
    if (JoinNum === null || JoinNum - 0 < 1) {
      Taro.showToast({ title: '请填入参加活动人数', icon: 'none' })
      setDataLock(false)
    } else {
      const { personId, phone, nickname, orgId } = user
      const { dynamicId } = ActivityDetail
      let Data = {
        phone,
        personId,
        dynamicId,
        name: nickname,
        orgId,
        attendNum: JoinNum - 0 || 1,
        sharePerson: null,
        sharePersonName: null,
        sharePersonType: null
      }
      request({ ...apis.JoinActivity, data: { ...Data } }).then(() => {
        Taro.showToast({ title: '报名成功', icon: 'none' })
        setShowJoinNumPopup(false)
        GetActivityDetail() // 获取活动详情
        setDataLock(false)
      }).catch((res) => {
        Taro.showToast({ title: res, icon: 'none' })
        setDataLock(false)
      })
    }
  }

  const ToJoin = () => { // 去报名
    if (DataLock || ActivityDetail === null || (Status - 0 !== 2 && Status - 0 !== 4)) return
    if (Status - 0 === 4) { // 去签到
      // Taro.navigateTo({ url: `/pages/HuoDong/HuoDongSign/index?id=${ActivityDetail.dynamicId}&from=detail` })
      Taro.scanCode({
        onlyFromCamera: true,
        success (res) {
          Taro.navigateTo({ url: `/${res.path}` })
        }
      })
    } else { // 去报名
      const { phone } = user
      if (!phone) { // 未授权手机号，唤起授权手机号弹窗
        setShowGetUserPhoneLayer(true)
        return false
      }
      setShowJoinNumPopup(true)
    }
  }

  const JoinNumChange = (e) => {
    setJoinNum(e.detail.value)
  }

  const showError = err => {
    Taro.showModal({
      title: '错误',
      content: err,
      showCancel: false
    })
  }

  return (
    <Page>
      <view className='HuoDongDetail'>

        <GetUserPhone visible={ShowGetUserPhoneLayer} onError={err => showError(`授权手机失败: ${err}`)} onCancel={() => { }}></GetUserPhone>

        <view className='BannerLayer'></view>
        {
          ActivityDetail !== null &&
          <view className='Banner'>
            <image mode='aspectFill' src={ActivityDetail.imgUrl} className='centerLabel'></image>
          </view>
        }
        {
          ActivityDetail !== null &&
          <view className='Info'>
            <view className='MainInfo'>
              <text className='Name'>{ActivityDetail.title}</text>
              <text className='Tips'>{ActivityDetail.enlisted}人已报名</text>
              <view className='flex-h'>
                <text>活动时间：</text>
                <view className='flex-item'>{toolclass.FormatDate(ActivityDetail.startDate)}<text>限{ActivityDetail.enlistNum}人</text></view>
              </view>
              <view className='flex-h'>
                <text>活动地址：</text>
                <view className='flex-item'>{ActivityDetail.address}</view>
              </view>
              <view className='flex-h'>
                <text>报名截止：</text>
                <view className='flex-item'>{toolclass.FormatDate(ActivityDetail.enlistEnd)}</view>
              </view>
            </view>

            <view className='Desc'>
              <text>活动介绍</text>
              <RichText nodes={`${ActivityDetail.desc !== null ? ActivityDetail.desc.replace(/font-size\:\s(\d+)px/ig, 'font-size: $1rpx') : ''}`}></RichText>
            </view>

            <text className={Status - 0 === 2 || Status - 0 === 4 ? 'active BottomBtn' : 'BottomBtn'} onClick={ToJoin}>{StatusText}</text>

          </view>
        }
        <view className={ShowJoinNumPopup ? 'JoinNumLayer active' : 'JoinNumLayer'}>
          <view className='centerLabel'>
            <text>温馨提示</text>
            <view className='flex-h Form'>
              <view>
                <text>参数人数：</text>
              </view>
              <view className='flex-item'>
                <Input placeholder='请输入活动参加人数' onInput={JoinNumChange} value={JoinNum}></Input>
              </view>
            </view>
            <view className='flex-h Bottom'>
              <view className='flex-item'>
                <text onClick={() => { setShowJoinNumPopup(false) }}>取消</text>
              </view>
              <view className='flex-item'>
                <text onClick={ConfirmToJoin}>确定</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </Page>
  )
}
