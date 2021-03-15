import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Input, Textarea } from '@tarojs/components'
import request, { apis } from '@/utils/request'
import { useModel } from '@/store'
import Page from '@/layouts'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WuYeXiuGaiBaoXiu () {

  const { user } = useModel('user')
  const [DataLock, setDataLock] = useState(false)
  const [DetailInfo, setDetailInfo] = useState(null)
  const [CurrnetId] = useState(useRouter().params.id)
  const [PhotoUrl, setPhotoUrl] = useState(null)
  const [repairType, setRepairType] = useState()

  useEffect(() => {
    Init()
  }, [CurrnetId])

  const Init = () => {
    request({ ...apis.getGongDanDetail, args: { orgId: user.orgId }, params: { ticketId: CurrnetId } }).then((res) => {
      setDetailInfo(res)
      setPhotoUrl(res.tdImagesList !== null && res.tdImagesList.length > 0 ? res.tdImagesList[0] : null)
    })
  }

  const handleTitleChange = ticketTitle => {
    setDetailInfo({ ...DetailInfo, ticketTitle })
  }

  const TitleChange = (e) => {
    setDetailInfo({ ...DetailInfo, ticketTitle: e.detail.value })
  }

  const DescChange = (e) => {
    setDetailInfo({ ...DetailInfo, ticketContent: e.detail.value })
  }

  const CheckForm = () => { // 校验报修单
    if (DetailInfo.ticketTitle === '') {
      Taro.showToast({ title: `报修标题不能为空`, icon: 'none' })
      return false
    }
    // if (DetailInfo.ticketContent === '') {
    //   Taro.showToast({ title: `报修描述不能为空`, icon: 'none' })
    //   return false
    // }
    return true
  }

  const Send = () => { // 提交报修
    if (DataLock || !CheckForm()) return
    setDataLock(true)
    request({
      ...apis.editGongDan,
      args: { id: CurrnetId },
      data: {
        ticketTitle: DetailInfo.ticketTitle,
        ticketContent: DetailInfo.ticketTitle,
        type: 2,
        imageUrl: PhotoUrl
      }
    }).then((res) => {
      Taro.showToast({ title: '报修修改成功', icon: 'none' })
      Taro.redirectTo({ url: `/pages/WuYe/BaoXiuDetail/index?id=${res.id}` })
      setDataLock(false)
    }).catch((res) => {
      Taro.showToast({ title: res, icon: 'none' })
      setDataLock(false)
    })
  }

  const AddImg = () => { // 添加图片
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        Taro.uploadFile({
          url: apis.uploadImage.url,
          filePath: tempFilePaths[0],
          name: 'file',
          formData: { user: 'upload' },
          header: { 'x-action': 'miniapp', 'authorization': `Bearer ${Taro.getStorageSync('token')}` },
          success: (cRes) => {
            setPhotoUrl(JSON.parse(cRes.data).data)
          }
        })
      }
    })
  }

  const DeleteItem = () => {
    setPhotoUrl(null)
  }

  useEffect(() => {
    if (DetailInfo && DetailInfo.repairType) {
      request({...apis.getRepairTypeDetail, args: {id: DetailInfo.repairType}}).then(res => setRepairType(res))
    }
  }, [DetailInfo])

  return (
    <Page>
      <view className='WuYeXiuGaiBaoXiu'>
        <view className='Form'>
          <Input placeholder='简述你的想法' onInput={TitleChange} value={DetailInfo === null ? null : DetailInfo.ticketTitle} style={{ display: 'none' }}></Input>
          <Textarea placeholder='描述问题详情，以便我们更好的相处' onInput={TitleChange} value={DetailInfo === null ? null : DetailInfo.ticketTitle}></Textarea>
          <view className='LabelList'>
            {
              (repairType || {tags: ''}).tags.split(',').map(tag => <text key={tag} onClick={() => handleTitleChange(DetailInfo.ticketTitle === '' ? tag : `${DetailInfo.ticketTitle}，${tag}`)}>{tag}</text>)
            }
          </view>
        </view>
        <view className='Photo'>
          <view className='Add' onClick={AddImg}>
            <view className='centerLabel'>
              <text className='iconfont iconxiangji'></text>
              <text>添加图片</text>
            </view>
          </view>
          {
            PhotoUrl !== null &&
            <view className='PhotoItem'>
              <text className='iconfont iconshanchu' onClick={DeleteItem}></text>
              <image mode='aspectFit' src={PhotoUrl}></image>
            </view>
          }
        </view>
        <view className='Btn'>
          <text onClick={Send}>确认修改</text>
        </view>
      </view>
    </Page>
  )
}
