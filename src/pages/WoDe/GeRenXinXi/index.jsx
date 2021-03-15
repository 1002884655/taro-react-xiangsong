import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import Page from '@/layouts'
import { useModel } from '@/store'
import { Input, Picker } from '@tarojs/components'
import request, { apis } from '@/utils/request'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function GeRenXinXi () {

  const { user, setUser } = useModel('user')
  const [Name, setName] = useState(null)
  const [Phone, setPhone] = useState(null)
  const [Birthday, setBirthday] = useState(null)
  const [ShowNameEdit, setShowNameEdit] = useState(false)
  const [ShowPhoneEdit, setShowPhoneEdit] = useState(false)
  const [ShowBirthdayEdit, setShowBirthdayEdit] = useState(false)
  const [Sex, setSex] = useState(null)
  const [SexList] = useState([{ id: 1, name: '男' }, { id: 2, name: '女' }])

  useEffect(() => {
    if (user !== null) {
      setName(user.name || user.nickname)
      setPhone(user.tel || user.phone)
      setBirthday(user.birthday)
      SexList.map((item, index) => {
        if (user.sex - 0 === item.id - 0 || user.gender - 0 === item.id - 0) {
          setSex(index)
        }
      })
    }
  }, [user])

  const NameChange = (e) => {
    setName(e.detail.value)
  }

  const PhoneChange = (e) => {
    setPhone(e.detail.value)
  }

  const BirthdayChange = (e) => {
    setBirthday(e.detail.value)
  }

  const SexChange = (e) => {
    request({ ...apis.EditUserInfo, data: { sex: SexList[e.detail.value - 0].id - 0 } }).then(() => {
      Taro.showToast({ title: '修改成功', icon: 'none' })
      setSex(e.detail.value - 0)
      setUser({ ...user, sex: SexList[e.detail.value - 0].id - 0 })
    }).catch((res) => {
      Taro.showToast({ title: res, icon: 'none' })
    })
  }

  const EditName = () => {
    request({ ...apis.EditUserInfo, data: { name: Name } }).then(() => {
      setShowNameEdit(false)
      Taro.showToast({ title: '修改成功', icon: 'none' })
      setUser({ ...user, name: Name })
    }).catch((res) => {
      Taro.showToast({ title: res, icon: 'none' })
    })
  }

  const EditPhone = () => {
    request({ ...apis.EditUserInfo, data: { phone: Phone } }).then(() => {
      setShowPhoneEdit(false)
      Taro.showToast({ title: '修改成功', icon: 'none' })
      setUser({ ...user, tel: Phone })
    }).catch((res) => {
      Taro.showToast({ title: res, icon: 'none' })
    })
  }

  const EditBirthday = () => {
    request({ ...apis.EditUserInfo, data: { birthday: Birthday } }).then(() => {
      setShowBirthdayEdit(false)
      Taro.showToast({ title: '修改成功', icon: 'none' })
      setUser({ ...user, birthday: Birthday })
    }).catch((res) => {
      Taro.showToast({ title: res, icon: 'none' })
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
            request({ ...apis.EditUserInfo, data: { avatar: JSON.parse(cRes.data).data } }).then(() => {
              Taro.showToast({ title: '修改成功', icon: 'none' })
              setUser({ ...user, avatarurl: JSON.parse(cRes.data).data })
            }).catch((eRes) => {
              Taro.showToast({ title: eRes, icon: 'none' })
            })
          }
        })
      }
    })
  }

  return (
    <Page>
      <view className='GeRenXinXi'>
        <view className='Form'>
          <view className='flex-h'>
            <text className='flex-item'>头像</text>
            <view className='UserIcon' onClick={AddImg}>
              <image mode='aspectFill' src={user !== null ? user.avatarurl : null}></image>
            </view>
          </view>
          <view className='flex-h' onClick={() => { setShowNameEdit(true) }}>
            <text className='flex-item'>姓名</text>
            <text>{Name}</text>
          </view>
          <view className='flex-h'>
            <text className='flex-item'>性别</text>
            {/* <text>{user !== null ? user.gender - 0 === 1 ? '男' : user.gender - 0 === 2 ? '女' : null : null}</text> */}
            <Picker value={Sex} range-key='name' range={SexList} onChange={SexChange}>
              <view className='PickerText'>{Sex === null ? '请选择性别' : SexList[Sex].id - 0 === 1 ? '男' : '女'}</view>
            </Picker>
          </view>
          <view className='flex-h' onClick={() => { setShowPhoneEdit(true) }}>
            <text className='flex-item'>联系电话</text>
            <text>{Phone}</text>
          </view>
          <view className='flex-h' onClick={() => { setShowBirthdayEdit(true) }}>
            <text className='flex-item'>生日</text>
            <text>{Birthday}</text>
          </view>
        </view>

        {
          ShowNameEdit &&
          <view className='Popup'>
            <view className='centerLabel'>
              <view className='Title'>
                <text>修改姓名</text>
              </view>
              <view className='Content'>
                <Input value={Name} onInput={NameChange}></Input>
              </view>
              <view className='Bottom flex-h'>
                <view className='flex-item'>
                  <text onClick={() => { setShowNameEdit(false); setName(user.nickname) }}>取消</text>
                </view>
                <view className='flex-item'>
                  <text onClick={EditName}>确定</text>
                </view>
              </view>
            </view>
          </view>
        }

        {
          ShowPhoneEdit &&
          <view className='Popup'>
            <view className='centerLabel'>
              <view className='Title'>
                <text>修改手机号</text>
              </view>
              <view className='Content'>
                <Input type='tel' value={Phone} onInput={PhoneChange}></Input>
              </view>
              <view className='Bottom flex-h'>
                <view className='flex-item'>
                  <text onClick={() => { setShowPhoneEdit(false); setPhone(user.phone) }}>取消</text>
                </view>
                <view className='flex-item'>
                  <text onClick={EditPhone}>确定</text>
                </view>
              </view>
            </view>
          </view>
        }

        {
          ShowBirthdayEdit &&
          <view className='Popup'>
            <view className='centerLabel'>
              <view className='Title'>
                <text>修改生日</text>
              </view>
              <view className='Content'>
                <Input placeholder='例如：2012-02-02' value={Birthday} onInput={BirthdayChange}></Input>
              </view>
              <view className='Bottom flex-h'>
                <view className='flex-item'>
                  <text onClick={() => { setShowBirthdayEdit(false); setBirthday(user.birthday) }}>取消</text>
                </view>
                <view className='flex-item'>
                  <text onClick={EditBirthday}>确定</text>
                </view>
              </view>
            </view>
          </view>
        }

        {/* <view className='Form'>
          <view className='flex-h'>
            <text className='flex-item'>身份</text>
            <text>业主</text>
          </view>
          <view className='flex-h'>
            <text className='flex-item'>联系电话</text>
            <text>13648041829</text>
          </view>
          <view className='flex-h'>
            <text>房产</text>
            <text className='flex-item'>南京市雨花台区安德门大姐56号凤翔山庄3区1栋3单元3楼309</text>
          </view>
        </view> */}
      </view>
    </Page>
  )
}
