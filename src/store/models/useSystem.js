import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'

// 保存系统相关参数
export default function useSystem() {
  const [sysInfo, setSysInfo] = useState()

  // const updateSysInfo = data => {
  //   // 固化到本地
  //   Taro.setStorage({ key: 'sys', data })
  //   setSysInfo(data)
  // }

  // useEffect(() => {
  //   // 如果本地存在, 则读取本地信息
  //   const u = Taro.getStorageSync('sys')
  //   if (u) {
  //     setSysInfo(u)
  //   }
  // }, [])

  return {
    sysInfo,
    setSysInfo
  }
}
