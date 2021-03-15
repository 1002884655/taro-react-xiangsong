import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import Page from '@/layouts/index'
import Card from './components/Card'
import { useModel } from '@/store'
import request, { apis } from '@/utils/request'
import ScrollPageRefresh from '@/components/ScrollPageRefresh/index'
import './index.less'

export default () => {

  const { user } = useModel('user')
  const [PageList, setPageList] = useState([])
  const [IsEmpty, setIsEmpty] = useState(false)
  const [DataLock, setDataLock] = useState(false)
  const [StarIndex, setStarIndex] = useState(0)
  const [CurrentUser, setCurrentUser] = useState(null)

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

  const PostScore = (e) => {
    return () => {
      setCurrentUser(e)
    }
  }

  const SelectStar = (index) => {
    return () => {
      setStarIndex(index)
    }
  }

  const SubmitScore = () => {
    if (!DataLock) {
      setDataLock(true)
      request({
        ...apis.PostOwnerScore,
        data: {
          orgId: user.orgId,
          personId: user.personId,
          score: StarIndex + 1,
          userId: CurrentUser.userId,
          communityId: user.communityId
        }
      }).then(() => {
        Taro.showToast({ title: '评价成功', icon: 'none' })
        setCurrentUser(null)
        setDataLock(false)
      }).catch((res) => {
        Taro.showToast({ title: res, icon: 'none' })
        setDataLock(false)
      })
    }
  }

  return (
    <Page>
      <view className='ScorePopup' style={{ display: CurrentUser === null ? 'none' : 'block' }}>
        <view className='centerLabel'>
          <view>
            <view className='Title'>
              <text>每月有一次评选机会</text>
              <text className='iconfont iconguanbi' onClick={() => { setCurrentUser(null) }}></text>
            </view>
            <view className='flex-h'>
              <view className='Icon'>
                <image mode='aspectFill' src={CurrentUser !== null ? CurrentUser.photo : null}></image>
              </view>
              <view className='flex-item'>
                <text>{CurrentUser !== null ? CurrentUser.userName : null}</text>
                <text>工号：{CurrentUser !== null ? CurrentUser.jobNumber : null}</text>
              </view>
            </view>
            <view className='Star'>
              {
                ['', '', '', '', ''].map((item, index) => (
                  <text className={index > StarIndex ? 'iconfont iconxingxing' : 'iconfont iconxingxing active'} key={`Star-${index}`} onClick={SelectStar(index)}></text>
                ))
              }
            </view>
            <view className='Submit'>
              <text onClick={SubmitScore}>提交</text>
            </view>
          </view>
        </view>
      </view>
      <ScrollPageRefresh RefreshBg='#f8f8f8' IsEmpty={IsEmpty} ApiName='getShengHuoGuanJiaList' RequestParams={{ taUserVerifyId: user.roomId, communityId: user.communityId }} Refresh={Refresh} Push={Push}>
        <view className='shgj'>
          {
            PageList.map(item => <Card key={item.userId} dataSource={item} PostScore={PostScore} />)
          }
        </view>
      </ScrollPageRefresh>
    </Page>
  )
}
