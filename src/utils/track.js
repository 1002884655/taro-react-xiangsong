import request, { apis } from './request'
import { getPage } from '.'

/**
 * 用户来源
 * @param {*} router 
 */
// eslint-disable-next-line import/prefer-default-export
export async function trackUserSource(router, qrcode) {
  const { path, scene, params } = router || {}

  const page = getPage(router)

  const trackPayload = {
    ...(page.track || {}),
    event: 'start',
    propertyName: page.name,
    data: '{}',
    id: params.id,
    realScene: scene,
    sceneId: scene,
    sharePersonId: (qrcode || {}).recommender || params.recommender,
  }

  try {
    const sceneList = [1005, 1006, 1053, 1042, 1007, 1008, 1011, 1012, 1013, 1045, 1046, 1047, 1048, 1058, 1067, 1000]

    if (sceneList.indexOf(trackPayload.sceneId) === -1) {
      trackPayload.sceneId = 1000
    }
    const { recordId } = await request({ ...apis.saveTracking, silent: true, data: trackPayload })

    return () => request({ ...apis.updateTracking, silent: true, args: { id: recordId } })
  } catch (e) {
    console.error('进入小程序埋点出错:', e);
    return function () { }
  }
}

/**
 * 分享埋点
 * params 一般需要如下传值：
 *    targetId: 当前页面的ID
 *    event: 默认是 share, 如果是海报分享, 请传值 poster
 * 
 * @param {*} params 
 */
export function shareTrack(params, user, router) {
  // 埋点
  const page = getPage(router) || {}
  const eventType =  (params || {}).eventType || page.eventType

  const { targetId, ...trackParams } = params || {}
  console.log(`设置 [${eventType}-${targetId}] 分享埋点` )

  // 分享设置
  if (targetId) {
    request({
      ...apis.setShare,
      silent: true,
      args: {
        type: eventType,
        id: targetId
      }
    }).then(res => console.log('--分享设置-->', res))
  }

  const data = {
    propertyName: page.name,
    data: '{}',
    ...(page.track || {}),
    targetId,
    event: 'share',
    ...trackParams,
    sharePersonId: user.personId,
    eventType,
  }

  request({ ...apis.saveTracking, silent: true, data }).then(res => {
    console.log('--分享埋点-->', res)
  })
}
