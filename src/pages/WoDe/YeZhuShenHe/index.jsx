import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import request, { apis } from '@/utils/request'
import { useModel } from '@/store'
import SlidePopup from '@/components/SlidePopup/index'
import Page from '@/layouts'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function YeZhuShenHe () {

  const { user } = useModel('user')
  const [Status] = useState(1)
  const [CurrnetId] = useState(useRouter().params.id) // 当前id
  const [PhoneList, setPhoneList] = useState([])
  const [ShowPopup, setShowPopup] = useState(false)
  const [Detail, setDetail] = useState(null)

  useEffect(() => {
    GetDetail()
    GetWuYePhoneList()
  }, [CurrnetId])

  const GetDetail = () => { // 获取详情
    request({ ...apis.getRenZhengDetail, args: { id: CurrnetId } }).then((res) => {
      setDetail(res)
    })
  }

  const GetWuYePhoneList = () => { // 获取物业电话
    request({ ...apis.getWuYePhone, params: { type: 'prop', communityId: user.communityId, taUserVerifyId: user.roomId } }).then((res) => {
      setPhoneList(res || [])
    })
  }

  const Detele = () => { // 删除当前资料
    Taro.showModal({
      title: '提示',
      content: '确认删除当前资料？',
      success: (res) => {
        if (res.confirm) {
          if (Detail.verifyStatus - 0 === 1) { // 删除审核通过的房产
            request({ ...apis.deletePassRenZheng, args: { id: CurrnetId } }).then((res) => {
              Taro.showToast({ title: '删除成功', icon: 'none' })
            }).catch((res) => {
              Taro.showToast({ title: res, icon: 'none' })
            })
          } else { // 删除审核中的房产
            request({ ...apis.deleteCheckingRenZheng, args: { id: CurrnetId } }).then((res) => {
              Taro.showToast({ title: '删除成功', icon: 'none' })
            }).catch((res) => {
              Taro.showToast({ title: res, icon: 'none' })
            })
          }
        }
      }
    })
  }

  return (
    <Page>
      <view className='YeZhuShenHe'>
        {
          Detail !== null &&
          <view className='ShenHeContent'>

            {/* 审核中 */}
            {
              Detail.verifyStatus - 0 === 0 &&
              <view className='CheckStatus Checking'>
                <view className='Status'>
                  <text className='iconfont iconshenhezhong'></text>
                  <text>审核中</text>
                  <text>请等待物业或户主审核</text>
                </view>

                <view className='Info'>
                  <view className='flex-h'>
                    <text>身份：</text>
                    <text className='flex-item'>{Detail.roleName || '业主'}</text>
                  </view>
                  <view className='flex-h'>
                    <text>房产：</text>
                    <text className='flex-item'>{Detail.phaseName} {Detail.buildingName} {Detail.unitName} {Detail.levelName} {Detail.roomNoName}</text>
                  </view>
                </view>
              </view>
            }

            {/* 审核通过 */}
            {
              Detail.verifyStatus - 0 === 1 &&
              <view className='CheckStatus Pass'>
                <view className='Status'>
                  <text className='iconfont iconyitongguo'></text>
                  <text>审核通过</text>
                </view>

                <view className='Info'>
                  <view className='flex-h'>
                    <text>身份：</text>
                    <text className='flex-item'>户主</text>
                  </view>
                  <view className='flex-h'>
                    <text>房产：</text>
                    <text className='flex-item'>{Detail.phaseName} {Detail.buildingName} {Detail.unitName} {Detail.levelName} {Detail.roomNoName}</text>
                  </view>
                </view>
              </view>
            }

            {/* 审核未通过 */}
            {
              Detail.verifyStatus - 0 === 2 &&
              <view className='CheckStatus NoPass'>
                <view className='Status'>
                  <text className='iconfont iconweitongguo'></text>
                  <text>审核未通过</text>
                </view>

                <view className='Info'>
                  <view className='flex-h'>
                    <text>审核人</text>
                    <text className='flex-item'>{Detail.verifyName || '-'}</text>
                  </view>
                  <view className='flex-h'>
                    <text>原因</text>
                    <text className='flex-item'>{Detail.remark || '-'}</text>
                  </view>
                </view>

                <view className='Info'>
                  <view className='flex-h'>
                    <text>身份</text>
                    <text className='flex-item'>户主</text>
                  </view>
                  <view className='flex-h'>
                    <text>房产</text>
                    <text className='flex-item'>{Detail.phaseName} {Detail.buildingName} {Detail.unitName} {Detail.levelName} {Detail.roomNoName}</text>
                  </view>
                </view>
              </view>
            }

            <view className='OtherTab'>
              <view className='flex-h' onClick={() => { setShowPopup(true) }}>
                <text className='flex-item'>联系物业</text>
                <text className='iconfont iconjiantouright'></text>
              </view>
              <view className='flex-h' onClick={Detele}>
                <text className='flex-item'>删除当前资料</text>
                <text className='iconfont iconjiantouright'></text>
              </view>
              <view className='flex-h' onClick={() => { Taro.redirectTo({ url: `/pages/WoDe/YeZhuRenZheng/index` }) }}>
                <text className='flex-item'>关联其他房产</text>
                <text className='iconfont iconjiantouright'></text>
              </view>
            </view>

            <view className='ContentBottom'></view>

          </view>
        }


        {/* 审核未通过 */}
        {
          Detail !== null && Status - 0 === 2 &&
          <view className='BottomBtn'>
            <text>重新认证</text>
          </view>
        }

        <SlidePopup Close={() => { setShowPopup(false) }} Show={ShowPopup}>
          <view className='LianXiPopup'>
            <text>联系物业</text>
            <text>对此费用有疑问</text>
            {
              PhoneList.map((item, index) => (
                <view className='flex-h' key={`PhoneList-${index}`} onClick={() => { Taro.makePhoneCall({ phoneNumber: item.tel }) }}>
                  <text className='flex-item'>{item.name}</text>
                  <text>{item.tel}</text>
                  <text className='iconfont icondianhua'></text>
                </view>
              ))
            }
          </view>
        </SlidePopup>
      </view>
    </Page>
  )
}
