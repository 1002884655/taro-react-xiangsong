import React, { useState, useEffect } from 'react'
import NavHeader from '@/components/NavHeader/index'
import ScrollPageRefresh from '@/components/ScrollPageRefresh/index'
import RenZhengScreen from '@/components/RenZhengScreen/index'
import { Swiper, SwiperItem, Text } from '@tarojs/components'
import request, { apis } from '@/utils/request'
import { useModel } from '@/store'
import useUserMounted from '@/utils/hooks/useUserMounted'
import Taro, { useRouter } from '@tarojs/taro'
import Page from '@/layouts'
import nav2detail from '@/utils/nav2detail'
import { getShareObject } from '@/utils/share'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function Index () {
  const router = useRouter()
  const { user } = useModel('user')
  const [OwnerList] = useState([
    { icon: require('@/assets/img/icon1.png'), name: '物业缴费', id: 1, router: '/pages/WuYe/index', setName: 'WuYeNavId', setValue: '4', isTab: true },
    { icon: require('@/assets/img/icon2.png'), name: '物业通知', id: 2, router: '/pages/WuYe/index', setName: 'WuYeNavId', setValue: '1', isTab: true },
    { icon: require('@/assets/img/icon3.png'), name: '物业报修', id: 3, router: '/pages/WuYe/index', setName: 'WuYeNavId', setValue: '3', isTab: true },
    // { icon: require('@/assets/img/icon4.png'), name: '业主认证', id: 4, router: '/pages/WoDe/WoDeRenZheng/index', isTab: false },
    { icon: require('@/assets/img/icon5.png'), name: '生活管家', id: 5, router: '/pages/WuYe/ShengHuoGuanJia/index', isTab: false, bold: true }
  ])
  // const [NavList] = useState([
  //   { icon: 'iconhuodong1', name: '活动', id: 1, router: '/pages/ShouYe/HuoDong/index', isTab: false },
  //   { icon: 'iconfuli1', name: '福利', id: 2, router: '/pages/FuLi/index', setName: null, setValue: null, isTab: true },
  //   { icon: 'iconfuwu', name: '服务', id: 3, router: '/pages/WuYe/index', setName: 'WuYeNavId', setValue: '2', isTab: true },
  //   { icon: 'iconxinwen', name: '资讯', id: 4, router: '/pages/ShouYe/ZiXun/index', isTab: false }
  // ])
  const [BannerList, setBannerList] = useState([])
  // const [ActivityList, setActivityList] = useState([])
  const [NewsList, setNewsList] = useState([])
  const [ShowNotice, setShowNotice] = useState(false)
  const [NoticeInfo, setNoticeInfo] = useState(null)
  const [NoticeWidth, setNoticeWidth] = useState(0)
  const [NoticeParentWidth, setNoticeParentWidth] = useState(0)

  // 宣传位
  const [propagandaList, setPropagandaList] = useState([])

  useUserMounted(() => {
    Init()
  })

  useEffect(() => {
    if (NoticeInfo !== null) {
      let WidthTimer = null
      CalcWidth(WidthTimer)
    }
  }, [NoticeInfo])

  const CalcWidth = (timer = null) => {
    timer = setTimeout(() => {
      let QueryParent = Taro.createSelectorQuery()
      let QueryChild = Taro.createSelectorQuery()
      if (QueryParent.select('#NoticeParent')) {
        clearTimeout(timer)
        QueryParent.select('#NoticeParent').boundingClientRect()
        QueryChild.select('#NoticeText').boundingClientRect()
        QueryParent.exec((res) => {
          setNoticeParentWidth(res[0].width)
          QueryChild.exec((cres) => {
            setNoticeWidth(cres[0].width)
          })
        })
      } else {
        CalcWidth(timer)
      }
    }, 100)
  }

  const Init = (done = () => { }) => { // 初始化
    GetNotice() // 获取通知
    let DownCount = 0
    GetBanner(() => { // 获取轮播图
      DownCount += 1
      if (CheckDownCount(DownCount)) {
        done()
      }
    })

    GetPropagandaList(() => { // 宣传位
      DownCount += 1
      if (CheckDownCount(DownCount)) {
        done()
      }
    })
    // GetActivityList(() => { // 获取活动列表
    //   DownCount += 1
    //   if (CheckDownCount(DownCount)) {
    //     done()
    //   }
    // })
    GetNewsList(() => { // 获取资讯列表
      DownCount += 1
      if (CheckDownCount(DownCount)) {
        done()
      }
    })
  }

  const GetNotice = () => { // 获取通知
    request({ ...apis.getGongGaoList, args: { orgId: 1 }, params: { annType: 'notice', pageNum: 1, pageSize: 1, communityId: user.communityId } }).then((res) => {
      setNoticeInfo(res.records[0])
      if (res.records !== null && res.records.length > 0) {
        setShowNotice(true)
      }
    })
  }

  const GetBanner = (done = () => { }) => { // 获取轮播图
    setBannerList([])
    request({ ...apis.getBanner, params: { showType: 'banner', showPosition: 'index', pageNum: 1, pageSize: 5 } }).then((res) => {
      setBannerList([...(res || [])])
      done()
    }).catch(() => {
      done()
    })
  }

  // const GetActivityList = (done = () => { }) => { // 获取活动列表
  //   setActivityList([])
  //   request({ ...apis.getActivityList, params: { pageNum: 1, pageSize: 1 } }).then((res) => {
  //     setActivityList([...res.list])
  //     done()
  //   }).catch(() => {
  //     done()
  //   })
  // }

  const GetPropagandaList = (done = () => { }) => {
    setPropagandaList([])
    request({ ...apis.getIndexAdv, params: { pageNum: 1, pageSize: 10, showType: 'propaganda' } }).then(res => {
      setPropagandaList([...(res || [])])
      done()
    }).catch(() => done())
  }

  const GetNewsList = (done = () => { }) => { // 获取资讯列表
    setNewsList([])
    request({ ...apis.getNewsList, params: { pageNum: 1, pageSize: 10 } }).then((res) => {
      setNewsList([...res.records])
      done()
    }).catch(() => {
      done()
    })
  }

  const CheckDownCount = (num) => { // 检测请求接口数量
    return num >= 3
  }

  // const NavClick = (item) => {
  //   return () => {
  //     if (item.isTab) {
  //       if (item.setName !== null) {
  //         Taro.setStorageSync(item.setName, item.setValue)
  //         Taro.reLaunch({ url: item.router })
  //       } else {
  //         Taro.switchTab({ url: item.router })
  //       }
  //     } else {
  //       Taro.navigateTo({ url: item.router })
  //     }
  //   }
  // }

  const Refresh = (e) => { // 页面下拉刷新
    Init(e)
  }

  const OwnerClick = (item) => {
    return () => {
      if (item.isTab) {
        if (item.setName !== null) {
          Taro.setStorageSync(item.setName, item.setValue)
          Taro.reLaunch({ url: item.router })
        } else {
          Taro.switchTab({ url: item.router })
        }
      } else {
        Taro.navigateTo({ url: item.router })
      }
    }
  }

  // 分享转发
  Taro.useShareAppMessage(() => {
    const shareObj = getShareObject({ title: '远道智慧社区' }, user, router)
    return shareObj
  })

  return (
    <Page>
      <view className='ShouYe flex-v'>
        <RenZhengScreen></RenZhengScreen>
        <NavHeader BgColor='#f35844' Title='首页'></NavHeader>
        <view className='flex-item'>

          {/* 正文 */}
          <view className='PageContainer'>
            <ScrollPageRefresh ListRefresh={false} Refresh={Refresh} RefreshBg='#f35844'>
              <view className='Content'>

                {/* 背景图 */}
                <view className='TopBg'></view>

                <view>

                  {/* 通知栏 */}
                  <view className='NoticeContent' style={{ display: ShowNotice ? 'block' : 'none' }}>
                    <view className='flex-h'>
                      <text className='iconfont icontongzhi1'></text>
                      <view id='NoticeParent' className='flex-item' onClick={() => { Taro.navigateTo({ url: `/pages/WuYe/GongGaoDetail/index?id=${NoticeInfo.id}` }) }}>
                        <view style={{ width: `${NoticeWidth > NoticeParentWidth ? NoticeWidth : NoticeParentWidth}px` }}>
                          <text id='NoticeText'>{NoticeInfo === null ? '' : NoticeInfo.announcementTitle}</text>
                        </view>
                      </view>
                      <text className='iconfont iconguanbi' onClick={() => { setShowNotice(false) }}></text>
                    </view>
                  </view>

                  {/* 欢迎词 */}
                  <Text className='Welcome'>欢迎来到远道智慧社区！</Text>

                  {/* banner */}
                  <view className='BannerContainer'>
                    <view>
                      <view>
                        <Swiper className='BannerSwiper' autoplay circular indicator-dots indicator-color='rgba(0,0,0,0.4)' indicator-active-color='rgba(255,255,255,0.8)'>
                          {
                            BannerList.map((item, index) => (
                              <SwiperItem className='SwiperItem' key={`Banner-${index}`}>
                                <view className='BannerItem' onClick={() => nav2detail({ type: item.contentType, id: item.targetId })}>
                                  <image mode='aspectFill' src={item.image}></image>
                                </view>
                              </SwiperItem>
                            ))
                          }
                        </Swiper>
                      </view>
                    </view>
                  </view>

                  {/* 导航 */}
                  {/* <view className='NavContainer flex-h'>
                    {
                      NavList.map((item, index) => (
                        <view key={`Nav-${index}`} className='flex-item'>
                          <view onClick={NavClick(item)}>
                            <view className='centerLabel'>
                              <Text className={`iconfont ${item.icon}`}></Text>
                              <Text>{item.name}</Text>
                            </view>
                          </view>
                        </view>
                      ))
                    }
                  </view> */}

                  {/* 业主专区 */}
                  <view className='OwnerContainer'>
                    <view>
                      {/* <view className='Title'>
                        <Text>业主专区</Text>
                      </view> */}
                      <view className='OwnerList flex-h'>
                        {
                          OwnerList.map((item, index) => (
                            <view className='flex-item' key={`Owners-${index}`} onClick={OwnerClick(item)}>
                              {/* <Text className={`iconfont ${item.icon}`} style={{ fontWeight: item.bold !== undefined && item.bold === true ? 'bold' : 'normal' }}></Text> */}
                              <image mode='heightFix' src={item.icon.default}></image>
                              <view>
                                <view><Text>{item.name}</Text></view>
                              </view>
                            </view>
                          ))
                        }
                      </view>
                    </view>
                  </view>

                  {/* 热门活动 */}
                  {/* <view className='HotActivityContainer'>
                    <view>
                      <view className='Activity' onClick={() => nav2detail({ type: 'comment', id: null })}>
                        <image className='centerLabel' mode='aspectFill' src='https://zhiyun-image.oss-cn-shanghai.aliyuncs.com/xiangsong/message-board.png'></image>
                      </view>
                    </view>
                  </view> */}
                  {
                    propagandaList.map((item, index) => (
                      <view className='HotActivityContainer' key={`HotActivity-${index}`}>
                        <view>
                          <view className='Activity' onClick={() => nav2detail({ type: item.contentType, id: item.targetId })}>
                            <image className='centerLabel' mode='aspectFill' src={item.image}></image>
                          </view>
                        </view>
                      </view>
                    ))
                  }

                  {/* 热门资讯 */}
                  <view className='NewsContainer'>
                    <view>
                      <view className='Title flex-h'>
                        <Text className='flex-item'>热门资讯</Text>
                        <Text onClick={() => { Taro.navigateTo({ url: '/pages/ShouYe/ZiXun/index' }) }}>查看全部</Text>
                        <Text className='iconfont iconjiantouright'></Text>
                      </view>
                      <view className='List'>
                        {
                          NewsList.map((item, index) => (
                            <view key={`News-${index}`} className='flex-h' onClick={() => { Taro.navigateTo({ url: `/pages/HuoDong/ZiXunDetail/index?id=${item.newsId}` }) }}>
                              <view className='Img'>
                                <image mode='aspectFill' src={item.newsImg} className='centerLabel'></image>
                              </view>
                              <view className='flex-item'>
                                <view><Text>{item.newsName}</Text></view>
                                <view><Text>{item.desc || ''}</Text></view>
                              </view>
                            </view>
                          ))
                        }
                      </view>
                    </view>
                  </view>

                  <view className='PageBottom'></view>

                </view>

              </view>
            </ScrollPageRefresh>
          </view>

        </view>
      </view>
    </Page>
  )
}
