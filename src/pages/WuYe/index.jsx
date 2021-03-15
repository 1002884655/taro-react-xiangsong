import React, { useState, useEffect } from 'react'
import TabPageCutNav from '@/components/TabPageCutNav/index'
import NavHeader from '@/components/NavHeader/index'
import WuYeGongGao from '@/components/WuYeGongGao/index'
import WuYeFuWu from '@/components/WuYeFuWu/index'
import WuYeBaoXiu from '@/components/WuYeBaoXiu/index'
import WuYeJiaoFei from '@/components/WuYeJiaoFei/index'
import Page from '@/layouts'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import { useModel } from '@/store'
import request, { apis } from '@/utils/request'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WuYe () {

  const { user, setUser } = useModel('user')
  const router = useRouter()
  const [NavList] = useState([{ name: '公告', id: 1 }, { name: '服务', id: 2 }, { name: '报修', id: 3 }, { name: '缴费', id: 4 }])
  const [CurrentNavId, setCurrentNavId] = useState(router.params.type - 0 || null)
  const [PageReset, setPageReset] = useState(false)

  useDidShow(() => {
    if (user !== null && user.verifyStatus !== 'certified') {
      Taro.login({
        success: res => {
          if (res.errMsg === 'login:ok') {
            request({ ...apis.login, params: { code: res.code, from: '', recommender: '', scene: '', mpOpenId: '' } }).then((cRes) => {
              setUser({ ...user, ...cRes.person })
              if (cRes.person.verifyStatus === 'certified') {
                if (CurrentNavId === null) {
                  if (Taro.getStorageSync('WuYeNavId')) {
                    setCurrentNavId(Taro.getStorageSync('WuYeNavId') - 0)
                  } else {
                    setCurrentNavId(1)
                  }
                }
              }
            })
          }
        }
      })
    } else {
      if (CurrentNavId - 0 === 3) {
        setPageReset(true)
      }
    }
  })

  useEffect(() => {
    if (user !== null) {
      if (user.verifyStatus === 'certified') {
        if (CurrentNavId === null) {
          if (Taro.getStorageSync('WuYeNavId')) {
            setCurrentNavId(Taro.getStorageSync('WuYeNavId') - 0)
          } else {
            setCurrentNavId(1)
          }
        } else {
          if (CurrentNavId - 0 === 3) {
            setPageReset(true)
          }
        }
      }
    }
  }, [CurrentNavId, user])

  // useEffect(() => {
  //   if (user.verifyStatus === 'certified') {
  //     if (CurrentNavId === null) {
  //       if (Taro.getStorageSync('WuYeNavId')) {
  //         setCurrentNavId(Taro.getStorageSync('WuYeNavId') - 0)
  //       } else {
  //         setCurrentNavId(1)
  //       }
  //     }
  //   }
  // }, [user])

  const NavChange = (e) => {
    return () => {
      setCurrentNavId(e.id)
    }
  }

  return (
    <Page>
      <view className='WuYe flex-v'>
        <NavHeader Title='物业' BgColor='none' IsFixed={true}></NavHeader>
        <TabPageCutNav List={NavList} CurrentNavId={CurrentNavId} NavChange={NavChange}></TabPageCutNav>
        <view className='flex-item'>
          <view>
            {/* 公告 */}
            {
              CurrentNavId - 0 === 1 &&
              <view className='Content GongGao'>
                <WuYeGongGao></WuYeGongGao>
              </view>
            }

            {/* 服务 */}
            {
              CurrentNavId - 0 === 2 &&
              <view className='Content FuWu'>
                <WuYeFuWu></WuYeFuWu>
              </view>
            }

            {/* 报修 */}
            {
              CurrentNavId - 0 === 3 &&
              <view className='Content BaoXiu'>
                <WuYeBaoXiu PageReset={PageReset} StopReset={() => { setPageReset(false) }}></WuYeBaoXiu>
              </view>
            }

            {/* 缴费 */}
            {
              CurrentNavId - 0 === 4 &&
              <view className='Content JiaoFei'>
                <WuYeJiaoFei></WuYeJiaoFei>
              </view>
            }
          </view>
        </view>
      </view>
    </Page>
  )
}
