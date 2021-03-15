import Taro from '@tarojs/taro'

export default function ({ type, id }) {
  switch (type) {
    case 'notice':
      Taro.navigateTo({ url: `/pages/WuYe/GongGaoDetail/index?id=${id}` })
      return
    case 'tpNews':
      Taro.navigateTo({ url: `/pages/WuYe/FuWuDetail/index?id=${id}` })
      return
    case 'activity':
      Taro.navigateTo({ url: `/pages/HuoDong/HuoDongDetail/index?id=${id}` })
      return
    case 'news':
      Taro.navigateTo({ url: `/pages/HuoDong/ZiXunDetail/index?id=${id}` })
      return
    case 'comment':
      Taro.navigateTo({ url: `/pages/ShouYe/YeZhuFanKui/index` })
      return
    default:
      break
  }
}
