import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { Button } from '@tarojs/components'
import request, { apis } from '@/utils/request'
import { useModel } from '@/store'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function GetUserPhone (props) {
  const [showPannel, setShowPannel] = useState(true)
  const { user, setUser } = useModel('user')
  const { appParams } = useModel('appParams')
  
  const ToGetUserPhone = (e) => { // 授权手机号
    const { errMsg, ...data } = e.detail
    if (errMsg === 'getPhoneNumber:ok') {
      request({
        ...apis.getUserPhone,
        data: {
          sessionKey: Taro.getStorageSync('sessionKey'),
          encryptedData: data.encryptedData,
          iv: data.iv,
          recommender: (appParams || {}).recommender || ''
        }
      }).then((res) => {
        setUser({ ...user, phone: res.phoneNumber })

        if (props.onOk) {
          props.onOk(res)
        }
      }).catch((er) => {
        setShowPannel(true)
        if (props.onError) {
          props.onError(er.message || er.errMsg || er)
        }
      })
    } else {
      setShowPannel(true)
      if (props.onError) {
        props.onError(errMsg)
      }
    }
  }

  const handleCancel = () => {
    if (props.onCancel) {
      props.onCancel()
    }
  }

  return props.visible && (
    <view className='GetUserPhone'>
      {
        showPannel && (
          <view className='centerLabel'>
            <text>您暂未授权手机号</text>
            <view className='flex-h'>
              <text className='flex-item' onClick={handleCancel}>取消</text>
              <Button
                className='flex-item'
                open-type='getPhoneNumber'
                lang='zh_CN'
                onGetphonenumber={ToGetUserPhone}
                onTap={() => setShowPannel(false)}
              >去授权</Button>
            </view>
          </view>
        )
      }
    </view>
  )
}
