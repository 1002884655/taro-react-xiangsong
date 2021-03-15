import React, { useEffect, useRef } from 'react'
import { useModel } from '@/store'
import { getPage } from '@/utils'
import request, { apis } from '../request'

/**
 * 页面埋点
 * params 一般不需要传值,
 * 特殊情况, 可以参考 ta_person_visit 表
 * 
 * @param {*} params 
 */
export default function useMountTrack(params, router) {
  const execed = useRef(false)
  const { user } = useModel('user')

  useEffect(() => {
    if (!user || !user.personId) {
      return
    }

    const page = getPage(router)
    if (!page) {
      return
    }

    // 只执行一次
    if (execed.current) {
      return
    } else {
      execed.current = true
    }

    const data = {
      propertyName: page.name,
      data: '{}',
      ...page.track,
      ...(params || {})
    }

    console.log(`执行页面 [${router.path}] 埋点`)

    let id = undefined
    request({ ...apis.saveTracking, silent: true, data }).then(res => {
      id = res.recordId
    })

    return () => id && request({ ...apis.updateTracking, silent: true, args: { id } })
  }, [params, user])
}
