import React, { useEffect, useState } from 'react'
import { Picker } from '@tarojs/components'

export default props => {
  const [index, setIndex] = useState()

  const handleChange = e => {
    const inx = e.detail.value - 0
    const item = props.range[inx]
    const value = item[props.rangeValue]
    if (props.onChange) {
      props.onChange(value, item)
    }
  }

  useEffect(() => {
    if (!props.range || !props.range.length) {
      setIndex()
    }

    const found = false
    for (let i = 0; i < props.range.length; i ++) {
      const item = props.range[i]
      if (item[props.rangeValue] === props.value) {
        setIndex(i)
        found = true
      }
    }

    if (!found) {
      setIndex()
    }
  }, [props.value, props.range, props.rangeValue])


  return <Picker {...props} value={index} onChange={handleChange}>{props.children}</Picker>
}
