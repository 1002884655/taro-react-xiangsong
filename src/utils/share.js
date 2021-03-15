import { shareTrack } from './track'
import { getPage } from '.'

/**
 * 返回分享对象
 * 一般情况下  params 需要设置 3 个属性
 *    id: 如果不设置, 会从 router 里面拿 id
 *    title: 分享的标题
 *    image: 分享图片
 * 
 * @param {*} params 
 * @param {*} user 
 */
export function getShareObject(params, user, router) {
  const page = getPage(router) || {}
  const { title, image, targetId, ...leftParams } = params || {}

  const event = (params || {}).event || 'share'
  const eventType =  (params || {}).eventType || page.eventType
  const id = targetId || router.params.id

  // 分享埋点
  shareTrack({
    ...leftParams,
    event,
    eventType,
    targetId,
  }, user, router)

  // 理论上 queryString 需要做 encodeURIComponent 处理
  const queryString = [
    `id=${id}`,
    `from=${eventType}`,
    `recommender=${user.personId}`
  ].join('&')

  // 返回分享对象
  return {
    title,
    imageUrl: image,
    path: `${router.path}?${queryString}`
  }
}
