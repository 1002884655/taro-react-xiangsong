import React from 'react'
import { View } from '@tarojs/components'
// import './index.less'

const cubeLen = 9

const inCenter = {
  display: 'block',
  width: '40vw',
  height: '40vw',
  margin: '15vh auto',
  position: 'relative'
}

export default props => {

  const color = props.color || '#9e1068'
  const tipText = props.tips || 'LOADING'
  const cubeStyle = { backgroundColor: color }
  const tipStyle = { color, textAlign: 'center', position: 'absolute', top: '45vw', left: 0, width: '100%' }

  return (
    <>
      {
        props.loading ? (
          <view style={inCenter}>
            <image style={{width: '100%'}} src={require('@/assets/img/loading.gif').default} mode="aspectFit" alt=""/>
            <view style={tipStyle}>{tipText}</view>
          </view>
        ) : props.children
        // (
        //   <View className='cubes-box'>            
        //     <View className='cubes'>
        //       {
        //         new Array(cubeLen).fill(0).map((_, inx) => (
        //           <View key={inx} class={`sk-cube sk-cube${inx + 1}`} style={cubeStyle}></View>
        //         ))
        //       }
        //     </View>
        //     <View className='cubes-tip' style={tipStyle}>{tipText}</View>
        //   </View>
        // ) : props.children
      }
    </>
  )
}
