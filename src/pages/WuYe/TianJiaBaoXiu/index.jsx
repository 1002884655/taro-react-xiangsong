import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Input, Textarea } from '@tarojs/components'
import request, { apis } from '@/utils/request'
import Page from '@/layouts'
import { useModel } from '@/store'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function WuYeTianJiaBaoXiu () {

  const { user } = useModel('user')
  const [Title, setTitle] = useState('')
  const [Desc, setDesc] = useState('')
  const [DataLock, setDataLock] = useState(false)
  const [PhotoUrl, setPhotoUrl] = useState(null)
  const [repairType, setRepairType] = useState()

  const rpType = useRouter().params.type

  const TitleChange = (e) => {
    setTitle(e.detail.value)
  }

  const DescChange = (e) => {
    setDesc(e.detail.value)
  }

  const CheckForm = () => { // 校验报修单
    if (Title === '') {
      Taro.showToast({ title: `报修标题不能为空`, icon: 'none' })
      return false
    }
    // if (Desc === '') {
    //   Taro.showToast({ title: `报修描述不能为空`, icon: 'none' })
    //   return false
    // }
    return true
  }

  const Send = () => { // 提交报修
    if (DataLock || !CheckForm()) return
    setDataLock(true)
    request({
      ...apis.AddGongDan,
      data: {
        ticketTitle: Title,
        ticketContent: Title,
        type: 2,
        repairType: repairType.typeId,
        imageUrl: PhotoUrl,
        taUserVerifyId: user.roomId,
        communityId: user.communityId
      }
    }).then((res) => {
      Taro.showToast({ title: '报修提交成功', icon: 'none' })
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
    if (rpType) {
      request({ ...apis.getRepairTypeDetail, args: { id: rpType } }).then(res => {
        setRepairType(res)
      })
    }
  }, [rpType])

  return (
    <Page>
      <view className='WuYeTianJiaBaoXiu'>
        <view className='Form'>
          <Input placeholder='简述你的想法' onInput={TitleChange} value={Title} style={{ display: 'none' }}></Input>
          <Textarea placeholder='描述问题详情，以便我们更好的相处' onInput={TitleChange} value={Title}></Textarea>
          <view className='LabelList'>
            {
              (repairType || { tags: '' }).tags.split(',').map(tag => <text key={tag} onClick={() => setTitle(Title === '' ? tag : `${Title}，${tag}`)}>{tag}</text>)
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
          <text onClick={Send}>确认发送</text>
        </view>
      </view>
    </Page>
  )
}
