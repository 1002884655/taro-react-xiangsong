import Taro from '@tarojs/taro'
import { apis, request2 } from './request'

export function getCardQrParam (user) {
  const param = [
    `id=${user.personId}`,
    `from=card`,
    `recommender=${user.personId}`
  ]

  return param.join('&')
}

export function getQrCodeImage (param, page) {
  const data = {scene: param, page: page.indexOf('/') === 0 ? page.substring(1) : page}

  return request2({ ...apis.qrcode, data })
}
