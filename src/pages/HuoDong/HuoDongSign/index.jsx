import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import request, { apis } from '@/utils/request'
import Page from '@/layouts'
import { useModel } from '@/store'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function HuoDongDetail () {

  const { user, setUser } = useModel('user')
  const [DataLock, setDataLock] = useState(false)
  const [HasSign, setHasSign] = useState(false)
  const [ShowSign, setShowSign] = useState(false)
  const [CurrnetId, setCurrentId] = useState(useRouter().params.id) // 当前活动id
  const [CurrnetSceneId] = useState(useRouter().params.scene) // 当前活动id
  const [ActivityDetail, setActivityDetail] = useState(null) // 活动详情
  const [JoinInfo, setJoinInfo] = useState(null) // 参加活动详情

  useEffect(() => {
    if (user && user.verifyStatus === 'certified' && CurrnetSceneId) {
      setShowSign(true)
    }
  }, [user, CurrnetSceneId])

  useEffect(() => {
    if (CurrnetId !== null && CurrnetId !== undefined) {
      GetActivityDetail()
    }
  }, [CurrnetId])

  useEffect(() => {
    if (JoinInfo !== null && JoinInfo.enlist !== null) {
      setHasSign(JoinInfo.enlist.isCheckin - 0 === 1)
    }
  }, [JoinInfo])

  useEffect(() => {
    if (CurrnetSceneId !== null && CurrnetSceneId !== undefined) {
      GetActivityInfoByScene()
    }
  }, [CurrnetSceneId])

  useEffect(() => {
    if (ActivityDetail !== null) {
      request({ ...apis.checkActivityJoin, args: { id: CurrnetId } }).then((res) => {
        setJoinInfo(res)
      })
    }
  }, [ActivityDetail])

  const GetActivityInfoByScene = () => {
    request({ ...apis.GetActivityInfoByScene, args: { sceneId: CurrnetSceneId } }).then((res) => {
      let Scene = JSON.parse(res).scene
      let startIndex = Scene.indexOf('id=') + 3
      let endIndex = Scene.indexOf('&type=')
      setCurrentId(Scene.substring(startIndex, endIndex))
    })
  }

  const GetActivityDetail = () => {
    request({ ...apis.getActivityDetail, args: { id: CurrnetId } }).then((res) => {
      setActivityDetail(res)
    })
  }

  // const QrCodeSign = () => {
  //   Taro.scanCode({
  //     onlyFromCamera: true,
  //     success (res) {
  //       Taro.navigateTo({ url: `/${res.path}` })
  //     }
  //   })
  // }

  const ToSign = () => {
    if (JoinInfo.enlist !== null) {
      if (!DataLock) {
        setDataLock(true)
        request({ ...apis.activitySign, args: { id: JoinInfo.enlist.enlistId } }).then(() => {
          Taro.showToast({ title: '签到成功，积分+1', icon: 'none' })
          setUser({ ...user, points: user.points - 0 > 0 ? user.points - 0 + 1 : 1 })
          GetActivityDetail()
          setDataLock(false)
          setHasSign(true)
        }).catch((res) => {
          Taro.showToast({ title: res, icon: 'none' })
          setDataLock(false)
        })
      }
    } else {
      Taro.navigateTo({ url: `/pages/HuoDong/HuoDongDetail/index?id=${CurrnetId}` })
    }
  }

  return (
    <Page>
      <view className='HuoDongSign'>
        <image mode='aspectFill' src='https://zhiyun-image.oss-cn-shanghai.aliyuncs.com/xiangsong/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20201218165430-min.jpg' className='centerLabel'></image>
        {
          ShowSign &&
          <view className={HasSign ? 'SignBtn' : 'SignBtn active'}>
            <view>
              {
                JoinInfo !== null && JoinInfo.enlist !== null &&
                <text className='centerLabel' onClick={ToSign}>{HasSign ? '已签到' : '签到'}</text>
              }
              {
                JoinInfo !== null && JoinInfo.enlist === null &&
                <text className='centerLabel' onClick={() => { Taro.navigateTo({ url: `/pages/HuoDong/HuoDongDetail/index?id=${CurrnetId}` }) }}>去报名</text>
              }
            </view>
          </view>
        }
        {/* {
          !CurrnetSceneId &&
          <view className='SignBtn active'>
            <view>
              <text className='centerLabel' onClick={QrCodeSign}>扫码</text>
            </view>
          </view>
        } */}
        {
          useRouter().params.from === 'detail' &&
          <view className='AlertPopup'>
            <view className='centerLabel'>
              <text>请扫码签到</text>
            </view>
          </view>
        }
      </view>
    </Page>
  )
}
