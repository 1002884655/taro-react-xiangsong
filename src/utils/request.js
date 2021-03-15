import Taro from '@tarojs/taro'
import log from './rtLog'
import $api from './api'

const accountInfo = Taro.getAccountInfoSync()
const appId = accountInfo.miniProgram.appId

const entries = obj => {
  const ownProps = Object.keys( obj )
  let i = ownProps.length
  const resArray = new Array(i)
  while (i--)
    resArray[i] = [ownProps[i], obj[ownProps[i]]]

  return resArray
}

const query2String = query => {
  return entries(query || {}).map(pair => `${encodeURIComponent(pair[0])}=${encodeURIComponent(pair[1])}`).join('&')
}

const transPathArgs = (path, args) => {
  return path.split('/').map(part => {
    return part && part.indexOf(':') === 0 ? args[part.substring(1)] : part
  }).join('/')
}

/**
 * 发起请求
 * 
 * @param {*} options 
 */
const request = options => {
  // args     path 参数
  // params   query 参数
  // data     body 参数
  // silent   静默模式, 如果是 true 则没有任何弹窗 或者 toast
  const { args, params, silent, url, header, ...leftOpts } = options || {}

  let realURL = url
  if (args) {
    realURL = transPathArgs(url, args)
  }

  if (params) {
    realURL += `?${query2String(params)}`
  }

  const token = Taro.getStorageSync('token')
  const authHeader = token ? { authorization: `Bearer ${token}`, 'X-Auth-Token': token } : {}
  const appHeader = { appId, 'x-action': 'miniapp' }

  const config = {
    url: realURL,
    header: {
      ...(header || {}),
      ...authHeader,
      ...appHeader,
    },
    ...leftOpts,
  }

  return new Promise((resolve, reject) => {
    Taro.request({
      ...config,
      success: res => {
        if (res.statusCode >= 300) {
          log.error(res, '==>', config)

          if (!silent) {
            const errMsg = `网络错误: ${res.statusCode}`
            Taro.showToast({
              title: errMsg,
              icon: 'none',
              duration: 3000
            })
          }
          return
        }

        const { data, code, message } = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
        if (code === 1000) {
          resolve(data)
        } else {
          reject(message)
        }
      },
      fail: err => {
        log.error(err, '==>', config)

        if (!silent) {
          const message = err.errMsg || err.message || ''
          const errMsg = message.indexOf('java') > -1 ? '服务内部错误' : `网络错误: ${message}`
  
          Taro.showToast({
            title: errMsg,
            icon: 'none',
            duration: 3000
          })
        }

        // reject(err)
      }
    })
  })
}

// request 不带 loading, 也不带错误处理
export default request

//
export const apis = $api

// 比 request 增加了 loading 以及 错误提示
export function request2(options) {
  const { showOk, okMessage, showLoading, ...config } = options || {}

  // 默认自带 loading
  if (showLoading !== false) {
    Taro.showLoading({ title: '请求中' })
  }

  return new Promise((resolve, reject) => {
    request(config).then(res => {
      if (showLoading !== false) {
        Taro.hideLoading()
      }

      if (showOk) {
        const t = setTimeout(() => {
          Taro.showToast({
            title: okMessage || '操作成功',
            icon: 'success',
            duration: 2000
          })

          clearTimeout(t)
        })
      } else {
        resolve(res)
      }
    }).catch(err => {
      if (showLoading !== false) {
        Taro.hideLoading()
      }

      const t = setTimeout(() => {
        Taro.showToast({
          title: err,
          icon: 'none',
          duration: 3000
        })

        clearTimeout(t)
      })

      reject(err)
    })
  })
}
