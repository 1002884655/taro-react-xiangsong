import React, { useEffect, useRef, useState } from 'react'
import Star from './Star'

// const total = new Array(5).fill(0).map((_, inx) => inx + 1)

// 小数得分会被转为整数
export default props => {
  const [score, setScore] = useState(0)
  const inited = useRef(false)
  const { total = 1 } = props
  let StarsArr = []
  for (let n = 0; n < total; n++) {
    StarsArr.push('')
  }

  // 暂时只写了默认以及 size=large 的样式
  const sizeClass = props.size ? `${gj - star}-${props.size}` : ''

  const handleClick = i => {
    if (props.editable) {
      setScore(i)
      if (props.onChange) {
        props.onChange(i)
      }
    }
  }

  useEffect(() => {
    if (props.value !== null && props.value !== undefined && !inited.current) {
      setScore(Math.floor(props.value))
      inited.current = true
    }
  }, [props.value])

  return (
    <view className='gj-stars'>
      {
        StarsArr.map((item, index) => (
          <Star className={`gj-start ${sizeClass}`} key={`stars-${index}`}></Star>
        ))
      }
      {/* {
        total.map(i => <Star className={`gj-start ${sizeClass}`} activeClass="gj-star-active" key={i} active={score >= i} onClick={() => handleClick(i)} />)
      } */}
    </view>
  )
}
