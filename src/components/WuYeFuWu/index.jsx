import React, { useState, useEffect } from 'react'
import { useModel } from '@/store'
import Taro from '@tarojs/taro'
import { Swiper, SwiperItem } from '@tarojs/components'
import WuYeFuWuItem from '@/components/WuYeFuWuItem/index'
import ScrollPageRefresh from '@/components/ScrollPageRefresh/index'
import request, { apis } from '@/utils/request'
import nav2detail from '@/utils/nav2detail'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import IconBlock from './components/IconBlock'
import './index.less'

export default function WuYeFuWu () {

  const { user } = useModel('user')
  const [PageList, setPageList] = useState([])
  const [BannerList, setBannerList] = useState([])
  const [typeList, setTypeList] = useState([])
  const [IsEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    GetBanner()

    request({ ...apis.getTpNewsList, params: { pageSize: 999 } }).then(res => setTypeList(res || []))
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
    <view className='WuYeFuWu'>
      <ScrollPageRefresh
        IsEmpty={IsEmpty}
        ApiName='getWuYeFuWuList'
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

            <view className='TypeList'>
              <view>
                <view onClick={() => { Taro.navigateTo({ url: `/pages/WuYe/GongGongFuWu/index` }) }}>
                  <view className='centerLabel'>
                    <view className='Icon'>
                      <image mode='aspectFit' src='https://zhiyun-image.oss-accelerate.aliyuncs.com/miniapp/upload/images/1608544670576-微信图片_20201221175016.png'></image>
                    </view>
                    <view className='Name'>
                      <text>公共服务</text>
                    </view>
                  </view>
                </view>
              </view>
              {
                typeList.map((item, index) => (
                  <view key={`TypeList-${index}`}>
                    <view onClick={() => { Taro.navigateTo({ url: `/pages/WuYe/FuWuList/index?type=${item.newsTypeId}&name=${item.newsTypeName}` }) }}>
                      <view className='centerLabel'>
                        <view className='Icon'>
                          <image mode='aspectFit' src={item.newsTypeImg}></image>
                        </view>
                        <view className='Name'>
                          <text>{item.newsTypeName}</text>
                        </view>
                      </view>
                    </view>
                  </view>
                ))
              }
            </view>
            <view className='ListTitle'>
              <text>热门信息</text>
            </view>
          </view>
        }
      >
        {/* 服务列表 */}
        <view className='List'>
          {
            PageList.map((item, index) => (
              <view key={`WuYeFuWuItem-${index}`}>
                <WuYeFuWuItem Data={item}></WuYeFuWuItem>
              </view>
            ))
          }
        </view>
      </ScrollPageRefresh>
    </view>
  )
}
