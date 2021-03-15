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


import React, { useEffect, useRef } from 'react'

export default function useUpdate(effect, deps) {
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) {
      effect()
    } else {
      mounted.current = true
    }
  }, deps)
}
