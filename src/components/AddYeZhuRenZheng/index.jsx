import React, { useState, useEffect } from 'react'
import { Input, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import request, { apis } from '@/utils/request'
import { useModel } from '@/store'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function AddYeZhuRenZheng (props) {

  const { user, setUser } = useModel('user')
  const [FormData, setFormData] = useState({ RealName: '', IdCard: '', Phone: '' })
  const [PhoneCode, setPhoneCode] = useState('')
  let CodeTimer = null
  const { Close = () => { } } = props
  const [CodeTimerNum, setCodeTimerNum] = useState(60)
  const [DataLock, setDataLock] = useState(false)
  const [Level1Value] = useState(user.orgId)
  const [Level2Value, setLevel2Value] = useState(null)
  const [Level2List, setLevel2List] = useState([])
  const [Level3Value, setLevel3Value] = useState(null)
  const [Level3List, setLevel3List] = useState([])
  const [Level4Value, setLevel4Value] = useState(null)
  const [Level4List, setLevel4List] = useState([])
  const [Level5Value, setLevel5Value] = useState(null)
  const [Level5List, setLevel5List] = useState([])
  const [Level6Value, setLevel6Value] = useState(null)
  const [Level6List, setLevel6List] = useState([])

  useEffect(() => {
    if (user !== null && user.phone !== null) {
      setFormData({ ...FormData, Phone: user.phone })
    }
  }, [user])

  useEffect(() => {
    GetLevel2List()
  }, [Level1Value])

  useEffect(() => {
    GetLevel3List()
  }, [Level2Value])

  useEffect(() => {
    GetLevel4List()
  }, [Level3Value])

  useEffect(() => {
    GetLevel5List()
  }, [Level4Value])

  useEffect(() => {
    GetLevel6List()
  }, [Level5Value])

  useEffect(() => {
    clearTimeout(CodeTimer)
    if (CodeTimerNum > 0 && CodeTimerNum < 60) {
      CodeTimer = setTimeout(() => {
        setCodeTimerNum(CodeTimerNum - 1)
      }, 1000)
    } else {
      clearTimeout(CodeTimer)
      setCodeTimerNum(60)
    }
  }, [CodeTimerNum])

  const CheckPhone = () => { // ???????????????
    return FormData.Phone && FormData.Phone.indexOf('1') === 0 && FormData.Phone.length === 11
  }

  const ToGetPhoneCode = () => {
    if (!CheckPhone()) {
      Taro.showToast({ title: '?????????????????????', icon: 'none' })
      return false
    }
    if (CodeTimerNum - 0 === 60) {
      request({ ...apis.getPhoneCode, params: { tel: FormData.Phone } }).then(() => {
        Taro.showToast({ title: '??????????????????', icon: 'none' })
        clearTimeout(CodeTimer)
        setCodeTimerNum(59)
      }).catch((res) => {
        Taro.showToast({ title: res, icon: 'none' })
        clearTimeout(CodeTimer)
        setCodeTimerNum(60)
      })
    }
  }

  const CheckForm = () => { // ????????????
    if (FormData.RealName === '') {
      Taro.showToast({ title: '???????????????', icon: 'none' })
      return false
    }
    if (FormData.IdCard === '') {
      Taro.showToast({ title: '??????????????????', icon: 'none' })
      return false
    }
    if (FormData.Phone === '') {
      Taro.showToast({ title: '??????????????????', icon: 'none' })
      return false
    }
    return true
  }

  const Submit = () => {
    if (DataLock) return
    setDataLock(true)
    if (PhoneCode === '') {
      Taro.showToast({ title: '??????????????????', icon: 'none' })
      setDataLock(false)
      return false
    }
    if (!CheckForm()) {
      setDataLock(false)
      return false
    }
    request({  // ?????????????????????????????????
      ...apis.checkOwnerVerify,
      params: {
        orgId: user.orgId,
        phaseId: Level2List[Level2Value].id,
        buildingId: Level3List[Level3Value].id,
        unitId: Level4List[Level4Value].id,
        levelId: Level5List[Level5Value].id,
        roomNoId: Level6List[Level6Value].id
      }
    }).then(() => {
      request({ ...apis.checkPhoneCode, params: { captcha: PhoneCode, tel: FormData.Phone } }).then(() => { // ???????????????
        request({ // ??????????????????
          ...apis.addOwnerVerify,
          data: {
            phaseId: Level2List[Level2Value].id,
            buildingId: Level3List[Level3Value].id,
            unitId: Level4List[Level4Value].id,
            levelId: Level5List[Level5Value].id,
            roomNoId: Level6List[Level6Value].id,
            phone: FormData.Phone,
            ownerName: FormData.RealName,
            idCard: FormData.IdCard
          }
        }).then(() => {
          Taro.showToast({ title: '??????????????????', icon: 'none' })
          setUser({ ...user, verifyStatus: 'certification_in_progress' })
          // Taro.navigateTo({ url: `/pages/WoDe/YeZhuShenHe/index?id=${res.id}` })
          // setDataLock(false)
        }).catch((res) => {
          Taro.showToast({ title: res, icon: 'none' })
          setDataLock(false)
        })
      }).catch((res) => {
        Taro.showToast({ title: res, icon: 'none' })
        setDataLock(false)
      })
    }).catch((res) => {
      Taro.showToast({ title: res, icon: 'none' })
      setDataLock(false)
    })
  }

  const GetLevel2List = () => {
    request({ ...apis.getRenZhengAddressList, params: { orgId: user.orgId } }).then((res) => {
      setLevel2List(res || [])
      if (res !== null && res.length > 0) {
        setLevel2Value(0)
      } else {
        setLevel2Value(null)
        setLevel2List([])
      }
    })
  }

  const GetLevel3List = () => {
    if (Level2Value !== null) {
      request({ ...apis.getRenZhengAddressList, params: { orgId: user.orgId, phaseId: Level2List[Level2Value].id } }).then((res) => {
        setLevel3List(res || [])
        if (res !== null && res.length > 0) {
          setLevel3Value(0)
        } else {
          setLevel3Value(null)
          setLevel3List([])
        }
      })
    } else {
      setLevel3Value(null)
      setLevel3List([])
    }
  }

  const GetLevel4List = () => {
    if (Level3Value !== null) {
      request({ ...apis.getRenZhengAddressList, params: { orgId: user.orgId, phaseId: Level2List[Level2Value].id, buildingId: Level3List[Level3Value].id } }).then((res) => {
        setLevel4List(res || [])
        if (res !== null && res.length > 0) {
          setLevel4Value(0)
        } else {
          setLevel4Value(null)
          setLevel4List([])
        }
      })
    } else {
      setLevel4Value(null)
      setLevel4List([])
    }
  }

  const GetLevel5List = () => {
    if (Level4Value !== null) {
      request({ ...apis.getRenZhengAddressList, params: { orgId: user.orgId, phaseId: Level2List[Level2Value].id, buildingId: Level3List[Level3Value].id, unitId: Level4List[Level4Value].id } }).then((res) => {
        setLevel5List(res || [])
        if (res !== null && res.length > 0) {
          setLevel5Value(0)
        } else {
          setLevel5Value(null)
          setLevel5List([])
        }
      })
    } else {
      setLevel5Value(null)
      setLevel5List([])
    }
  }

  const GetLevel6List = () => {
    if (Level5Value !== null) {
      request({ ...apis.getRenZhengAddressList, params: { orgId: user.orgId, phaseId: Level2List[Level2Value].id, buildingId: Level3List[Level3Value].id, unitId: Level4List[Level4Value].id, levelId: Level5List[Level5Value].id } }).then((res) => {
        setLevel6List(res || [])
        if (res !== null && res.length > 0) {
          setLevel6Value(0)
        } else {
          setLevel6Value(null)
          setLevel6List([])
        }
      })
    } else {
      setLevel6Value(null)
      setLevel6List([])
    }
  }

  const Level2Change = (e) => {
    setLevel2Value(e.detail.value - 0)
  }

  const Level3Change = (e) => {
    setLevel3Value(e.detail.value - 0)
  }

  const Level4Change = (e) => {
    setLevel4Value(e.detail.value - 0)
  }

  const Level5Change = (e) => {
    setLevel5Value(e.detail.value - 0)
  }

  const Level6Change = (e) => {
    setLevel6Value(e.detail.value - 0)
  }

  return (
    <view className='AddYeZhuRenZheng'>
      <view className='Close'>
        <text>????????????</text>
      </view>
      <view className='Form'>
        <view className='flex-h'>
          <text className='iconfont iconxingming'></text>
          <Input className='flex-item' placeholder='?????????????????????' value={FormData.RealName} onInput={(e) => { setFormData({ ...FormData, RealName: e.detail.value }) }}></Input>
        </view>
        <view className='flex-h'>
          <text className='iconfont iconshenfenzheng'></text>
          <Input type='idcard' className='flex-item' placeholder='??????????????????????????????' value={FormData.IdCard} onInput={(e) => { setFormData({ ...FormData, IdCard: e.detail.value }) }}></Input>
        </view>
        <view className='flex-h'>
          <text className='iconfont iconshouji'></text>
          <Input type='idcard' className='flex-item' placeholder='???????????????????????????' value={FormData.Phone} onInput={(e) => { setFormData({ ...FormData, Phone: e.detail.value }) }}></Input>
        </view>
        <view className='flex-h'>
          <text className='iconfont iconyanzhengma'></text>
          <Input type='idcard' className='flex-item' placeholder='??????????????????' value={PhoneCode} onInput={(e) => { setPhoneCode(e.detail.value) }}></Input>
          <text className={CodeTimerNum - 0 === 60 ? 'active' : ''} onClick={ToGetPhoneCode}>{CodeTimerNum - 0 === 60 ? `???????????????` : `${CodeTimerNum > 9 ? `${CodeTimerNum}s???????????????` : `0${CodeTimerNum}s???????????????`}`}</text>
        </view>
        <view className='flex-h'>
          <text>??????</text>
          <view className='flex-item'>
            <Picker value={Level2Value} range-key='name' range={Level2List} onChange={Level2Change}>
              <view className='PickerText'>{Level2List.length > 0 && Level2Value !== null ? Level2List[Level2Value].name : '???????????????'}</view>
            </Picker>
          </view>
        </view>
        <view className='flex-h'>
          <text>??????</text>
          <view className='flex-item'>
            <Picker value={Level3Value} range-key='name' range={Level3List} onChange={Level3Change}>
              <view className='PickerText'>{Level3List.length > 0 && Level3Value !== null ? Level3List[Level3Value].name : '???????????????'}</view>
            </Picker>
          </view>
        </view>
        <view className='flex-h'>
          <text>??????</text>
          <view className='flex-item'>
            <Picker value={Level4Value} range-key='name' range={Level4List} onChange={Level4Change}>
              <view className='PickerText'>{Level4List.length > 0 && Level4Value !== null ? Level4List[Level4Value].name : '???????????????'}</view>
            </Picker>
          </view>
        </view>
        <view className='flex-h'>
          <text>??????</text>
          <view className='flex-item'>
            <Picker value={Level5Value} range-key='name' range={Level5List} onChange={Level5Change}>
              <view className='PickerText'>{Level5List.length > 0 && Level5Value !== null ? Level5List[Level5Value].name : '???????????????'}</view>
            </Picker>
          </view>
        </view>
        <view className='flex-h'>
          <text>??????</text>
          <view className='flex-item'>
            <Picker value={Level6Value} range-key='name' range={Level6List} onChange={Level6Change}>
              <view className='PickerText'>{Level6List.length > 0 && Level6Value !== null ? Level6List[Level6Value].name : '???????????????'}</view>
            </Picker>
          </view>
        </view>
      </view>
      <view className='BottomBtn' onClick={Submit}>
        <text>??????</text>
      </view>
    </view>
  )
}
