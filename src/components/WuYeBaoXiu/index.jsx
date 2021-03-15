import React, { useState, useEffect } from 'react'
import { useModel } from '@/store'
import Taro, { useDidShow } from '@tarojs/taro'
import { Swiper, SwiperItem } from '@tarojs/components'
import WuYeBaoXiuItem from '@/components/WuYeBaoXiuItem/index'
import ScrollPageRefresh from '@/components/ScrollPageRefresh/index'
import request, { apis } from '@/utils/request'
import nav2detail from '@/utils/nav2detail'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WuYeBaoXiu (props) {

  const { user } = useModel('user')
  const [PageList, setPageList] = useState([])
  const [BannerList, setBannerList] = useState([])
  const [IsEmpty, setIsEmpty] = useState(false)
  const [Reset, setReset] = useState(false)
  const { PageReset = false, StopReset = () => {} } = props

  useEffect(() => {
    if (PageReset) {
      setReset(true)
    }
  }, [PageReset])

  const GetBanner = (done = () => { }) => { // 获取轮播图
    request({ ...apis.getBanner, params: { showPosition: `property`, showType: 'banner', pageSize: 5, pageNum: 1 } }).then((res) => {
      setBannerList([...(res || [])])
      done()
    }).catch(() => {
      done()
    })
  }

  const Refresh = (e) => { // 下拉刷新
    StopReset()
    GetBanner()
    if (e.length > 0) {
      setIsEmpty(false)
      setPageList(e)
    } else {
      setIsEmpty(true)
    }
  }

  const Push = (e) => { // 上拉加载
    setPageList(PageList.concat(e))
  }

  return (
    <view className='WuYeBaoXiu'>
      <ScrollPageRefresh
        AutoRequest={false}
        Reset={Reset}
        CloseReset={() => { setReset(false) }}
        IsEmpty={IsEmpty}
        ApiName='getGongDanList'
        ListName='pagelist'
        RequestUrlData={{ orgId: user.orgId }}
        RequestParams={{ type: 2, taUserVerifyId: user.roomId, communityId: user.communityId }}
        Refresh={Refresh}
        Push={Push}
        KeepChildren={
          <view>
            {/* 大图 */}
            <view className='BigImg'>
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

            {/* 我要报修 */}
            <view className='WoYaoBaoXiu'>
              <view onClick={() => { Taro.navigateTo({ url: `/pages/WuYe/BaoXiuQuYu/index` }) }}>
                <text className='iconfont iconjia'></text>
                <text>我要报修</text>
              </view>
            </view>
          </view>
        }
      >
        {/* 报修列表 */}
        <view className='List'>
          {
            PageList.map((item, index) => (
              <view key={`WuYeBaoXiuItem-${index}`}>
                <WuYeBaoXiuItem Data={{ ...item }}></WuYeBaoXiuItem>
              </view>
            ))
          }
        </view>
      </ScrollPageRefresh>
    </view>
  )
}
