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


export default function(initialState) {
  let state = initialState
  const listeners = []

  const subscribe = f => {
    const len = listeners.length
    listeners.push(f)
    return () => listeners.splice(len, 1)
  }

  const publish = (s) => {
    if (s) state = s

    listeners.forEach(f => f(state))
  }

  const getState = () => state

  return {
    subscribe,
    publish,
    getState
  }
}
