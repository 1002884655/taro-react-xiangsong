import React, { useRef, useEffect } from 'react'
import { useModel } from '@/store'

export default function useUserMounted(callback) {
  const mounted = useRef(false)
  const { user } = useModel('user')

  useEffect(() => {
    if (user && !mounted.current) {
      mounted.current = true
      return callback()
    }
  }, [user])
}
