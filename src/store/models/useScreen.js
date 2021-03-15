import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'

export default function useScreen () {
  const [screen, setScreen] = useState({ FirstComing: true })

  // const updateUser = data => {
  //   // 固化到本地
  //   Taro.setStorage({ key: 'user', data })
  //   setUser(data)
  // }

  // useEffect(() => {
  //   // 如果本地存在, 则读取本地信息
  //   const u = Taro.getStorageSync('user')
  //   if (u) {
  //     setUser(u)
  //   }
  // }, [])

  return {
    screen,
    setScreen
  }
}
