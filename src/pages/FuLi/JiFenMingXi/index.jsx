import React, { useState } from 'react'
import CustomHeader from '@/components/CustomHeader'
import ScrollPageRefresh from '@/components/ScrollPageRefresh/index'
import Taro from '@tarojs/taro'
import Page from '@/layouts'
import toolclass from '@/utils/toolclass.js'
import { useModel } from '@/store'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function JiFenMingXi () {

  const { user } = useModel('user')
  const [PageList, setPageList] = useState([])
  const [CurrentNavId, setCurrentNavId] = useState(1)
  const [NavList] = useState([{ name: '全部', id: 1 }, { name: '积分收入', id: 2 }, { name: '积分支出', id: 3 }])
  const [IsEmpty, setIsEmpty] = useState(false)

  const CutNav = (target) => {
    return () => {
      setCurrentNavId(target.id)
    }
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
    <Page>
      <view className='JiFenMingXi flex-v'>
        <CustomHeader IsFixed={true} BgColor='none' Title='积分明细'></CustomHeader>
        <view className='TopContainer'>
          <view className='centerLabel'>
            <view className='flex-h'>
              <view className='flex-item'>
                <text>当前积分</text>
                <text>{user.points || 0}</text>
              </view>
              <text onClick={() => { Taro.navigateTo({ url: `/pages/FuLi/JiFenGuiZe/index` }) }}>积分规则</text>
              <text className='iconfont iconjiantouright'></text>
            </view>
          </view>
        </view>
        <view className='NavList flex-h'>
          {
            NavList.map((item, index) => (
              <view key={`Nav-${index}`} className='flex-item' onClick={CutNav(item)}>
                <text className={CurrentNavId - 0 === item.id - 0 ? 'active' : ''}>{item.name}</text>
              </view>
            ))
          }
        </view>
        <view className='flex-item'>
          <view>
            {
              CurrentNavId - 0 === 1 &&
              <ScrollPageRefresh IsEmpty={IsEmpty} ApiName={`getJiFenRecords`} Refresh={Refresh} Push={Push}>
                <view className='List'>
                  {
                    PageList.map((item, index) => (
                      <view className='flex-h' key={`List-${index}`}>
                        <view className='flex-item'>
                          <text>{item.recordName}</text>
                          <text>{toolclass.FormatDate(item.createDate)}</text>
                        </view>
                        <text className={item.pointsAmount - 0 > 0 ? '' : 'active'}>{item.pointsAmount}</text>
                      </view>
                    ))
                  }
                </view>
              </ScrollPageRefresh>
            }
            {
              CurrentNavId - 0 === 2 &&
              <ScrollPageRefresh IsEmpty={IsEmpty} ApiName={`getJiFenRecords`} RequestParams={{ inout: 1 }} Refresh={Refresh} Push={Push}>
                <view className='List'>
                  {
                    PageList.map((item, index) => (
                      <view className='flex-h' key={`List-${index}`}>
                        <view className='flex-item'>
                          <text>{item.recordName}</text>
                          <text>{toolclass.FormatDate(item.createDate)}</text>
                        </view>
                        <text className={item.pointsAmount - 0 > 0 ? '' : 'active'}>{item.pointsAmount}</text>
                      </view>
                    ))
                  }
                </view>
              </ScrollPageRefresh>
            }
            {
              CurrentNavId - 0 === 3 &&
              <ScrollPageRefresh IsEmpty={IsEmpty} ApiName={`getJiFenRecords`} RequestParams={{ inout: -1 }} Refresh={Refresh} Push={Push}>
                <view className='List'>
                  {
                    PageList.map((item, index) => (
                      <view className='flex-h' key={`List-${index}`}>
                        <view className='flex-item'>
                          <text>{item.recordName}</text>
                          <text>{toolclass.FormatDate(item.createDate)}</text>
                        </view>
                        <text className={item.pointsAmount - 0 > 0 ? '' : 'active'}>{item.pointsAmount}</text>
                      </view>
                    ))
                  }
                </view>
              </ScrollPageRefresh>
            }
          </view>
        </view>
      </view>
    </Page>
  )
}
