import React, { useEffect, useState } from 'react'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import AdvLayer from '@/components/AdvLayer'
import GetUserIcon from '@/components/GetUserIcon/index'
import GetUserPhone from '@/components/GetUserPhone/index'
import RenZhengScreen from '@/components/RenZhengScreen'
import Spin from '@/components/Spin'
import { getPage } from '@/utils'
import { useModel } from '@/store'
import useMountTrack from '@/utils/hooks/useMountTrack'
import './index.less'

const pages = require('../pages')

const showError = err => {
  Taro.showModal({
    title: '错误',
    content: err,
    showCancel: false
  })
}

export default function (props) {
  const { user } = useModel('user')
  const router = useRouter()

  const [page, setPage] = useState({})
  const [loading, setLoading] = useState(true)
  const [showAuthBasic, setShowAuthBasic] = useState(false)
  const [showAuthYeZhu, setShowAuthYeZhu] = useState(false)
  const [showAuthPhone, setShowAuthPhone] = useState(false)

  const [isAuthedBasic, setIsAuthedBasic] = useState(false)
  const [isAuthedPhone, setIsAuthedPhone] = useState(false)
  const [isAuthedYeZhu, setIsAuthedYeZhu] = useState(false)

  const [needAuthBasic, setNeedAuthBasic] = useState(false)
  const [needAuthPhone, setNeedAuthPhone] = useState(false)
  const [needAuthYeZhu, setNeedAuthYeZhu] = useState(false)

  const goback = () => Taro.navigateBack({ delta: 1, fail: () => Taro.switchTab({ url: '/pages/ShouYe/index' }) })

  useDidShow(() => {
    setPage(getPage(router))
  })

  useEffect(() => {
    setLoading(!user || !user.personId)
    setIsAuthedBasic(user && user.avatarurl && user.nickname)
    setIsAuthedPhone(user && user.phone)
    setIsAuthedYeZhu(user && user.verifyStatus === 'certified')
  }, [user])

  useEffect(() => {
    setNeedAuthBasic((page.auth || []).indexOf('avatar') > -1)
    setNeedAuthPhone((page.auth || []).indexOf('phone') > -1)
    setNeedAuthYeZhu((page.auth || []).indexOf('yezhu') > -1)
  }, [page])

  // 埋点
  useMountTrack({}, router)

  // 授权手机
  useEffect(() => {
    if (!isAuthedPhone && needAuthPhone) {
      setShowAuthPhone(true)
    } else {
      setShowAuthPhone(false)
    }
  }, [isAuthedPhone, needAuthPhone])

  // 认证业主
  useEffect(() => {
    // 如果当前是认证业务页面
    if (page.isYeZhuRenZheng) {
      setShowAuthYeZhu(false)
      return
    }

    if (isAuthedPhone && !isAuthedYeZhu && needAuthYeZhu) {
      setShowAuthYeZhu(true)
    } else {
      setShowAuthYeZhu(false)
    }
  }, [needAuthYeZhu, isAuthedPhone, page, isAuthedYeZhu])

  // 授权头像
  useEffect(() => {
    let needShow = false

    // 授权手机之后才授权头像
    if (isAuthedPhone) {
      // 要求业主认证的
      if (isAuthedYeZhu || !needAuthYeZhu) {
        if (!isAuthedBasic && needAuthBasic) {
          needShow = true
        }
      }
    }

    setShowAuthBasic(needShow)
  }, [isAuthedBasic, needAuthBasic, isAuthedPhone, isAuthedYeZhu, needAuthYeZhu])

  return (
    <Spin loading={loading}>
      {/* 广告 */}
      <AdvLayer></AdvLayer>
      <RenZhengScreen Show={showAuthYeZhu}></RenZhengScreen>
      <GetUserIcon visible={showAuthBasic} onError={err => showError(`授权头像失败: ${err}`)} onCancel={goback} />
      <GetUserPhone visible={showAuthPhone} onError={err => showError(`授权手机失败: ${err}`)} onCancel={goback} />
      {/* <YeZhuRenZhengPopup Show={showAuthYeZhu} Close={() => { }}></YeZhuRenZhengPopup> */}
      {
        props.children
      }
    </Spin>
  )
}
