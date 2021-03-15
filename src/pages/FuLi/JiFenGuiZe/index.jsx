import React, { useState, useEffect } from 'react'
import CustomHeader from '@/components/CustomHeader/index'
import request, { apis } from '@/utils/request'
import Page from '@/layouts'
import '@/assets/css/reset.less'
import '@/assets/css/iconfont.less'
import './index.less'

export default function JiFenGuiZe () {

  const [RuleList, setRuleList] = useState([])

  useEffect(() => {
    Init()
  }, [])

  const Init = () => {
    request({ ...apis.getJiFenRule, params: { pageNum: 1, pageSize: 1000 } }).then((res) => {
      setRuleList(res.records || [])
    })
  }

  return (
    <Page>
      <view className='JiFenGuiZe'>
        <CustomHeader IsFixed={true} BgColor='none' Title='积分规则'></CustomHeader>

        <view className='JiFenContent'>
          <view>
            <view className='Img'>
              <image mode='widthFix' src='https://zhiyun-image.oss-cn-shanghai.aliyuncs.com/xiangsong/img.png'></image>
            </view>
            {/* <view className='Title'>
              <text>积分兑换时间</text>
            </view>
            <text>2020年11月30日09:00-2020年12月30日15:00</text> */}
            <view className='Title'>
              <text>积分兑换规则</text>
            </view>
            <text>1）积分仅兑换积分商城中的商品，不能折算现金；</text>
            <text>2）兑换商品中所要求的积分需达到要求方可兑换；</text>
            <text>3）兑换商品图片仅供参考，商品以实际领取为准。</text>
            {
              RuleList.length > 0 &&
              <view className='RuleList'>
                <view className='flex-h'>
                  <view className='flex-item'>
                    <text style={{ textAlign: 'center' }}>途径</text>
                  </view>
                  <view>分数</view>
                </view>
                {
                  RuleList.map((item, index) => (
                    <view className='flex-h' key={`RuleList-${index}`}>
                      <view className='flex-item'>
                        <text>{item.remark}</text>
                      </view>
                      <view>{item.pointsAmount}</view>
                    </view>
                  ))
                }
              </view>
            }
          </view>
        </view>
      </view>
    </Page>
  )
}
