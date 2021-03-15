import React, { useState, useEffect } from 'react'
import request, { apis } from '@/utils/request'
import ScrollPage from '@/components/ScrollPage/index'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function ScrollPageRefresh (props) {

  const { AutoRequest = true, Reset = false, CloseReset = () => { }, KeepChildren = null, SearchKey = null, IsEmpty = false, ApiName = '', ListRefresh = true, ListName = 'records', RequestParams = {}, RequestData = null, RequestUrlData = null, PageSize = 10, Refresh = () => { }, Push = () => { }, RefreshBg = 'none' } = props
  const [FirstRequest, setFirstRequest] = useState(true)
  const [IsPullUp, setIsPullUp] = useState(false)
  const [IsPullDown, setIsPullDown] = useState(false)
  const [HasNextPage, setHasNextPage] = useState(true)
  const [PageNum, setPageNum] = useState(1)

  useEffect(() => {
    if (AutoRequest) {
      if (ListRefresh) {
        setFirstRequest(false)
        GetPageList(() => {
          setIsPullDown(false)
          setIsPullUp(false)
        })
      }
    } else {
      if (!FirstRequest) {
        if (ListRefresh) {
          setFirstRequest(false)
          GetPageList(() => {
            setIsPullDown(false)
            setIsPullUp(false)
          })
        }
      }
    }
  }, [PageNum])

  useEffect(() => {
    if (Reset) {
      OnRefresh()
      CloseReset()
    }
  }, [Reset])

  useEffect(() => {
    if (SearchKey !== null) {
      OnRefresh()
    }
  }, [SearchKey])

  const GetPageList = (done = () => { }) => { // 获取列表
    let RequestBody = {
      ...apis[ApiName],
      params: { ...RequestParams, pageNum: PageNum, pageSize: PageSize }
    }
    if (RequestData !== null) {
      RequestBody.data = { ...RequestData }
    }
    if (RequestUrlData !== null) {
      RequestBody.args = { ...RequestUrlData }
    }

    request({ ...RequestBody }).then((res) => {
      if (PageNum === 1) {
        if (ListName === null) {
          Refresh([...res])
        } else {
          Refresh([...res[ListName]])
        }
      } else {
        if (ListName === null) {
          Push([...res])
        } else {
          Push([...res[ListName]])
        }
      }
      if (ListName === null) {
        setHasNextPage(false)
      } else {
        if (res[ListName].length) {
          setHasNextPage(res.current - 0 < res.pages - 0)
        } else if (res.total === 0) {
          setHasNextPage(false)
        }
      }
      done()
    }).catch(() => {
      done()
    })
  }

  const OnRefresh = () => { // 页面下拉刷新
    setIsPullDown(true)
    if (ListRefresh) {
      setPageNum(1)
      if (PageNum === 1) {
        GetPageList(() => {
          setIsPullDown(false)
        })
      } else {
        setPageNum(1)
      }
    } else {
      Refresh(() => {
        setIsPullDown(false)
      })
    }
  }

  const OnPullUp = () => {
    if (HasNextPage) {
      setIsPullUp(true)
      setPageNum(PageNum + 1)
    }
  }

  return (
    <view className='ScrollPageRefresh'>
      <ScrollPage IsEmpty={IsEmpty} KeepChildren={KeepChildren} ListRefresh={ListRefresh} OnRefresh={OnRefresh} IsPullUp={IsPullUp} IsPullDown={IsPullDown} OnPullUp={OnPullUp} HasMore={HasNextPage} RefreshBg={RefreshBg}>
        {
          props.children
        }
      </ScrollPage>
    </view>
  )
}
