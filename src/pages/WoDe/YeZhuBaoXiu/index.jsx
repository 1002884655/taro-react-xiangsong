import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import ScrollPageRefresh from '@/components/ScrollPageRefresh'
import { useModel } from '@/store'
import Page from '@/layouts'
import Item from './components/Item'
import request, { apis } from '@/utils/request'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WoDeGongDan () {

  const { user } = useModel('user')
  const [PageList, setPageList] = useState([])
  const [IsEmpty, setIsEmpty] = useState(false)

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

  const handleItemAction = item => {
    Taro.showModal({
      title: '提示',
      content: '确认结束当前工单?',
      success: res => {
        if (res.confirm) {
          request({...apis.endTicket, data:{ticketId: item.id}}).then(x => {
            Taro.showToast({
              title: '结单成功',
              icon: 'success'
            })
          })
        }
      }
    })
  }

  return (
    <Page>
      <view className='WoDeGongDan'>
        <ScrollPageRefresh IsEmpty={IsEmpty} ApiName={`getGuanJiaGongDanList`} ListName={`pagelist`} RequestParams={{ communityId: user.communityId }} Refresh={Refresh} Push={Push}>
          <view className='Content Activity'>
            {
              PageList.map((item, index) => (
                <view className='ListItem' key={`ActivityItem-${index}`}>
                  <Item Data={item} onAction={() => handleItemAction(item)}></Item>
                </view>
              ))
            }
          </view>
        </ScrollPageRefresh>
      </view>
    </Page>
  )
}
