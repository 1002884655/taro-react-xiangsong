import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { Button } from '@tarojs/components'
import request, { apis } from '@/utils/request'
import { useModel } from '@/store'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function GetUserIcon (props) {
  const [showPannel, setShowPannel] = useState(true)
  const { user, setUser } = useModel('user')

  const ToGetUserIcon = (e) => { // 授权用户头像
    const { errMsg, ...data } = e.detail
    if (errMsg === 'getUserInfo:ok') {
      request({
        ...apis.userAutInfo,
        data: {
          sessionKey: Taro.getStorageSync('sessionKey'),
          ...data,
        }
      }).then(res => {
        const { person } = res
        setUser({
          ...user,
          ...person
        })
        if (props.onOk) {
          props.onOk(res)
        }
      }).catch(er => {
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
    <view className='GetUserIcon'>
      {
        showPannel && (
          <view className='centerLabel'>
            <text>您暂未授权头像</text>
            <view className='flex-h'>
              <text className='flex-item' onClick={handleCancel}>取消</text>
              <Button
                className='flex-item'
                open-type='getUserInfo'
                lang='zh_CN'
                onGetUserInfo={ToGetUserIcon}
                onTap={() => setShowPannel(false)}
              >去授权</Button>
            </view>
          </view>
        )
      }
    </view>
  )
}
