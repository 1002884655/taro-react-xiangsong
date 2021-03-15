import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'

// 保存系统进入时的参数
export default function useAppParams() {
  const [appParams, setAppParams] = useState()

  return {
    appParams,
    setAppParams
  }
}
