import React, { useState, useEffect } from 'react'
import request, { apis } from '@/utils/request'
import { Text } from '@tarojs/components'
import { useModel } from '@/store'
import nav2detail from '@/utils/nav2detail'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function AdvLayer () {

  const { screen, setScreen } = useModel('screen')
  const [AdvDetail, setAdvDetail] = useState(null)
  const [ShowIndexAdv, setShowIndexAdv] = useState(false)

  useEffect(() => {
    if (screen.FirstComing) {
      request({ ...apis.getIndexAdv, params: { showType: `screen`, showPosition: `index` } }).then((res) => {
        setScreen({ FirstComing: false })
        if (res !== null && res.length > 0) {
          setAdvDetail(res[0])
          setShowIndexAdv(true)
        }
      })
    }
  }, [screen])

  const AdvClick = () => {
    setShowIndexAdv(false)
    nav2detail({type: AdvDetail.contentType, id: AdvDetail.targetId})
  }

  return (
    <view className='AdvLayer' style={{ display: ShowIndexAdv ? 'block' : 'none' }}>
      <view className='centerLabel'>
        <image mode='widthFix' src={AdvDetail !== null ? AdvDetail.image : null} onClick={AdvClick}></image>
        <Text className='iconfont iconguanbi' onClick={() => { setShowIndexAdv(false) }}></Text>
      </view>
    </view>
  )
}
