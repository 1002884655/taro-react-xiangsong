import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import CustomHeader from '@/components/CustomHeader/index'
import { getQrCodeImage, getCardQrParam } from '@/utils/qrcode'
import Page from '@/layouts'
import { getShareObject } from '@/utils/share.js'
import { useModel } from '@/store'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function TuiJianErWeiMa () {
  const router = useRouter()
  const { user } = useModel('user')
  const [QrCodeImg, setQrCodeImg] = useState(null)

  Taro.useShareAppMessage(() => {
    console.log(router, `router`)
    return getShareObject({
      title: '推荐二维码',
      id: user.personId,
      image: QrCodeImg
    }, user, { ...router, path: `/pages/ShouYe/index` })
  })

  useEffect(() => {
    if (QrCodeImg === null) {
      // const page = Taro.useRouter().path
      const page = '/pages/ShouYe/index'
      getQrCodeImage(getCardQrParam(user), page).then(x => setQrCodeImg(x))
    }
  }, [QrCodeImg])

  return (
    <Page>
      <view className='TuiJianErWeiMa'>
        <CustomHeader IsFixed={true} BgColor='none' Title='推荐二维码'></CustomHeader>
        <image mode='widthFix' src='https://zhiyun-image.oss-cn-shanghai.aliyuncs.com/xiangsong/img2.jpg'></image>
        <image mode='widthFix' className='QrCodeImg' src={QrCodeImg}></image>
      </view>
    </Page>
  )
}
