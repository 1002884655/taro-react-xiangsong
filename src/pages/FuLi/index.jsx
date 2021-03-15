import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import NavHeader from '@/components/NavHeader/index'
import PrizeListItem from '@/components/PrizeListItem/index'
import ScrollPageRefresh from '@/components/ScrollPageRefresh/index'
import request, { apis } from '@/utils/request'
import Page from '@/layouts'
import { useModel } from '@/store'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function FuLi () {

  const { user, setUser } = useModel('user')
  const [BannerList, setBannerList] = useState([])
  const [DataLock, setDataLock] = useState(false)
  const [PageList, setPageList] = useState([])

  useEffect(() => {
    if (user !== null && user.havaSigned === undefined) {
      request({ ...apis.getUserInfo }).then((res) => {
        setUser({ ...user, ...res })
      }).catch((res) => {
        Taro.showToast({ title: res, icon: 'none' })
      })
    }
    GetBanner()
  }, [])

  const GetBanner = (done = () => { }) => { // 获取轮播图
    setBannerList([])
    request({ ...apis.getBanner, params: { showPosition: 'mall', pageNum: 1, pageSize: 1 } }).then((res) => {
      setBannerList([...(res || [])])
      done()
    }).catch(() => {
      done()
    })
  }

  const ToSign = () => { // 签到
    if (DataLock || (user.havaSigned !== undefined && user.havaSigned - 0 === 1)) return
    setDataLock(true)
    request({ ...apis.userSign }).then(() => {
      Taro.showToast({ title: '签到成功，积分+1', icon: 'none' })
      setUser({ ...user, havaSigned: 1, points: user.points - 0 > 0 ? user.points - 0 + 1 : 1 })
      setDataLock(false)
    }).catch((res) => {
      Taro.showToast({ title: res, icon: 'none' })
      setDataLock(false)
    })
  }

  const Refresh = (e) => { // 下拉刷新
    setPageList(e)
  }

  const Push = (e) => { // 上拉加载
    setPageList(PageList.concat(e))
  }

  return (
    <Page>
      <view className='FuLi flex-v'>
        <NavHeader BgColor='none' Title='福利' IsFixed={true}></NavHeader>

        {/* 顶部背景图 */}
        <view className='TopBg'>
          <image mode='aspectFill' src={BannerList.length > 0 ? BannerList[0].image : null} class='centerLabel'></image>
        </view>

        {/* 正文 */}
        <view className='flex-item'>
          <view>
            <ScrollPageRefresh
              ApiName={`getGoodsList`}
              Refresh={Refresh}
              Push={Push}
              KeepChildren={
                <view className='FuLiContent'>
                  {/* 用户面板 */}
                  <view className='UserTab'>
                    <view>
                      <view className='Info flex-h'>
                        <view className='Icon'>
                          {
                            user !== null &&
                            <image mode='aspectFill' src={user.avatarurl} class='centerLabel'></image>
                          }
                        </view>
                        <view className='flex-item'>
                          <text>{user === null ? '未登录' : user.nickname || '未授权用户信息'}</text>
                          <text>积分{user === null ? '-' : user.points || 0}</text>
                        </view>
                        {
                          user.havaSigned !== undefined &&
                          <text className={user.havaSigned - 0 === 1 ? '' : 'active'} onClick={ToSign}>{user.havaSigned - 0 === 1 ? '已签到' : '签到'}</text>
                        }
                      </view>
                      <view className='Rule flex-h'>
                        <view className='flex-item' onClick={() => { Taro.navigateTo({ url: '/pages/FuLi/JiFenGuiZe/index' }) }}>
                          <text className='iconfont iconjifen'></text>
                          <text>积分规则</text>
                        </view>
                        <view className='flex-item' onClick={() => { Taro.navigateTo({ url: '/pages/FuLi/JiFenMingXi/index' }) }}>
                          <text className='iconfont iconjifenguize'></text>
                          <text>积分明细</text>
                        </view>
                      </view>
                    </view>
                  </view>

                  {/* 搜索框 */}
                  <view className='SearchContainer'>
                    <view onClick={() => { Taro.navigateTo({ url: `/pages/FuLi/ShangPinFilter/index` }) }}>
                      <text className='iconfont iconsousuo'></text>
                      <text>附近热搜：火锅</text>
                    </view>
                  </view>
                </view>
              }
            >
              <view className='FuLiContent'>
                {/* 积分礼品列表 */}
                <view className='PirzeList'>
                  {
                    PageList.map((item, index) => (
                      <view key={`PirzeListItem-${index}`}>
                        <view>
                          <PrizeListItem Data={item}></PrizeListItem>
                        </view>
                      </view>
                    ))
                  }
                </view>
              </view>
            </ScrollPageRefresh>
          </view>
        </view>

      </view>
    </Page>
  )
}
