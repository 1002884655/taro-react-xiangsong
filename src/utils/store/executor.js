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


import React, { useEffect, useMemo } from 'react'
import useUpdate from './utils/useUpdate'

const noop = () => undefined

const entries = obj => {
  const ownProps = Object.keys( obj )
  let i = ownProps.length
  const resArray = new Array(i)
  while (i--)
    resArray[i] = [ownProps[i], obj[ownProps[i]]]

  return resArray
}

// 所有的 Model 会分别被绑定到各自 Executor 上
// 借用 Executor onUpdate 把 Model 的变化传递到各订阅的组件上
export function Executor(props) {
  if (!props.store || !props.namespace) {
    throw new Error("[Executor] props.store 与 props.namespace 不能为空")
  }

  const { store, namespace, model = noop } = props
  const data = model()

  // 首次加载立即执行
  const deModel = useMemo(() => {
    return store.model(namespace, data)
  }, [])

  // 如果组件卸载, 则卸载 model
  useEffect(() => {
    store.getModel(namespace).publish()
    return deModel
  }, [])

  // 传递 model 变化到订阅组件
  useUpdate(() => {
    store.getModel(namespace).publish(data)
  }, [data])

  return <></>
}

export function createExecutors(store, models) {
  return function Executors(props) {
    return (
      <>
      {
        entries(models).map(pair => {
          const [namespace, hook] = pair
          return <Executor key={namespace} namespace={namespace} model={hook} store={store} />
        })
      }
      </>
    )
  }
}

