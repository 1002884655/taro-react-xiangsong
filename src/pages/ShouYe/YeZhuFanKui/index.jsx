import React, { useState, useEffect } from 'react'
import { Input } from '@tarojs/components'
import Page from '@/layouts'
import request, { apis } from '@/utils/request'
import Taro from '@tarojs/taro'
import toolclass from '@/utils/toolclass.js'
import { useModel } from '@/store'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function YeZhuFanKui () {

  const { user } = useModel('user')
  const [CommentText, setCommentText] = useState('')
  const [PageList, setPageList] = useState([])
  const [DataLock, setDataLock] = useState(false)
  const [PageNum, setPageNum] = useState(1)
  const [HasNextPage, setHasNextPage] = useState(true)
  const [ScrollTop, setScrollTop] = useState(0)
  const [Timer, setTimer] = useState(null)
  const [ScrollTimer, setScrollTimer] = useState(null)

  useEffect(() => {
    if (user !== null) {
      if (PageNum - 0 === 1) {
        setPageList([])
      }
      GetPageList(PageNum - 0 === 1)
    }
  }, [user, PageNum])

  useEffect(() => {
    if (PageList.length && PageList[PageList.length - 1].isLocal) {
      clearTimeout(Timer)
      setTimer(setTimeout(() => {
        setPageList(PageList.concat([{
          avatar: user.avatarurl,
          content: '亲爱的业主，感谢您的反馈，工作人员稍后将为您进行回复。',
          createDate: Date.now(),
          msgId: PageList.length ? PageList[0].msgId : '',
          nickname: '物业管理',
          userId: 1
        }]))
        clearTimeout(ScrollTimer)
        setScrollTimer(setTimeout(() => {
          setScrollTop(10000 + Date.now())
        }, 300))
      }, 300))
    }
  }, [PageList])

  const GetPageList = (bool = false) => {
    if (HasNextPage) {
      request({
        ...apis.GetCommentList,
        params: { pageNum: PageNum, pageSize: 10 }
      }).then((res) => {
        let List = res.records || []
        let Arr = []
        List.map((item) => {
          Arr.unshift({ ...item, isLocal: false })
        })
        setPageList(Arr.concat(PageList))
        setHasNextPage(res.current - 0 < res.pages - 0)
        if (bool) {
          clearTimeout(ScrollTimer)
          setScrollTimer(setTimeout(() => {
            setScrollTop(10000 + Date.now())
          }, 300))
        }
        setDataLock(false)
      }).catch((res) => {
        Taro.showToast({ title: res, icon: 'none' })
        setDataLock(false)
      })
    }
  }

  const CommentTextChange = (e) => {
    setCommentText(e.detail.value)
  }

  const SubmitComment = () => {
    if (!DataLock) {
      setDataLock(true)
      request({
        ...apis.SendComment,
        data: {
          msgId: PageList.length ? PageList[0].msgId : '',
          content: CommentText
        }
      }).then(() => {
        setPageList(PageList.concat([{
          isLocal: true,
          avatar: user.avatarurl,
          content: CommentText,
          createDate: Date.now(),
          msgId: PageList.length ? PageList[0].msgId : '',
          nickname: user.nickname,
          userId: null
        }]))
        setCommentText('')
        clearTimeout(ScrollTimer)
        setScrollTimer(setTimeout(() => {
          setScrollTop(10000 + Date.now())
        }, 300))
        setDataLock(false)
      }).catch((res) => {
        Taro.showToast({ title: res, icon: 'none' })
        setDataLock(false)
      })
    }
  }

  const GetMore = () => {
    if (!DataLock && HasNextPage) {
      setDataLock(true)
      setPageNum(PageNum + 1)
    }
  }

  return (
    <Page>
      <view className='YeZhuFanKui flex-v'>
        <view className='flex-item'>
          <view>
            <scroll-view scroll-y='true' style='height: 100%;' scroll-top={ScrollTop}>
              <view className='YeZhuFanKuiContent'>
                <view className='GetMore'>
                  <text className={HasNextPage ? 'active' : ''} onClick={GetMore}>{HasNextPage ? '点击查看历史' : '没有更早的记录'}</text>
                </view>
                {
                  PageList.map((item, index) => (
                    <view className='ListItem' key={`Item-${index}`} id={`ListItem-${index}`}>
                      <view className='Time'>
                        <text>{toolclass.FormatDate(item.createDate)}</text>
                      </view>
                      <view className='flex-h'>
                        {
                          item.userId !== null &&
                          <view className='Icon'>
                            <image mode='aspectFill' className='centerLabel' src='https://zhiyun-image.oss-accelerate.aliyuncs.com/xiangsong/logo.png'></image>
                          </view>
                        }
                        <view className={item.userId === null ? 'flex-item' : 'flex-item active'}>
                          <text>{item.content}</text>
                        </view>
                        {
                          item.userId === null &&
                          <view className='Icon'>
                            <image mode='aspectFill' className='centerLabel' src={item.avatar}></image>
                          </view>
                        }
                      </view>
                    </view>
                  ))
                }
                <view className='CommentBottom' id={`CommentBottom-${PageList.length}`}></view>
              </view>
            </scroll-view>
          </view>
        </view>
        <view className='Form flex-h'>
          <view className='flex-item'>
            <Input placeholder='简述你的想法' onInput={CommentTextChange} value={CommentText}></Input>
          </view>
          <view>
            <text onClick={SubmitComment}>发送</text>
          </view>
        </view>
      </view>
    </Page >
  )
}
