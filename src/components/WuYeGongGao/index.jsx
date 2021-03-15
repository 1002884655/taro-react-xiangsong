import React, { useState, useEffect } from 'react'
import { useModel } from '@/store'
import Taro from '@tarojs/taro'
import { Swiper, SwiperItem } from '@tarojs/components'
import WuYeGongGaoItem from '@/components/WuYeGongGaoItem/index'
import ScrollPageRefresh from '@/components/ScrollPageRefresh/index'
import request, { apis } from '@/utils/request'
import nav2detail from '@/utils/nav2detail'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WuYeGongGao () {

  const { user } = useModel('user')
  const [PageList, setPageList] = useState([])
  const [BannerList, setBannerList] = useState([])
  const [IsEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    GetBanner()
  }, [])

  const GetBanner = (done = () => { }) => { // 获取轮播图
    request({ ...apis.getBanner, params: { showPosition: `property`, showType: 'banner', pageNum: 1, pageSize: 5 } }).then((res) => {
      setBannerList([...(res || [])])
      done()
    }).catch(() => {
      done()
    })
  }

  const Refresh = (e) => { // 下拉刷新
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
    <view className='WuYeGongGao'>
      <ScrollPageRefresh
        IsEmpty={IsEmpty}
        ApiName={`getGongGaoList`}
        RequestUrlData={{ orgId: user.orgId }}
        RequestParams={{ taUserVerifyId: user.roomId, communityId: user.communityId }}
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
          </view>
        }
      >
        {/* 列表 */}
        <view className='List'>
          {
            PageList.map((item, index) => (
              <view key={`WuYeGongGaoItem-${index}`}>
                <WuYeGongGaoItem Data={item}></WuYeGongGaoItem>
              </view>
            ))
          }
        </view>
      </ScrollPageRefresh>
    </view>
  )
}
