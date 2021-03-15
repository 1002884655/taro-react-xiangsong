/*
 * Copyright (c) [2020] Zhang Yansen.All rights reserved.
 *
 * use-async is licensed under the Mulan PSL v2.
 * You can use this software according to the terms and conditions of the Mulan PSL v2.
 * You may obtain a copy of Mulan PSL v2 at:
 *
 *     http://license.coscl.org.cn/MulanPSL2
 *
 * THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
 * MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
 * See the Mulan PSL v2 for more details.
 */


import React, { useRef, useEffect, useCallback, useState } from 'react'

const isEqual = require('fast-deep-equal/react')
const getBySelectorOrNot = (data, selector) => selector ? selector(data) : data

export function createModelHook(store) {
  return function useModel(namespace, selector) {
    if (!namespace) {
      throw new Error('[useModel] namespace 不能为空')
    }
  
    const selectorRef = useRef()
    selectorRef.current = selector
  
    const model = store.getModel(namespace)
    const initialData = getBySelectorOrNot(model.getState(), selectorRef.current)
    const [state, setState] = useState(initialData)
    const stateRef = useRef()
    stateRef.current = state
  
    const renderTrigger = useCallback((e) => {
      const preState = stateRef.current
      const curState = getBySelectorOrNot(e, selectorRef.current)
  
      if (!isEqual(preState, curState)) {
        setState(curState)
      } else {
        setState(e)
      }
    },[])
  
    useEffect(() => {
      // 如果需要触发修改则触发 renderTrigger
      // subscribe 返回取消订阅的函数
      const model = store.getModel(namespace)
      const deSubscribe = model.subscribe(renderTrigger)
      // 通知组件更新
      model.publish()
      return deSubscribe
    }, [namespace])
  
    return state
  }  
}
