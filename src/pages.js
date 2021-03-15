
const Main = [
  {
    name: '首页',
    page: 'pages/ShouYe/index',
    auth: [],
    track: {
      event: 'index',
      eventType: 'main',
    }
  },
  {
    name: '首页-业主反馈',
    page: 'pages/ShouYe/YeZhuFanKui/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'list',
      eventType: 'comment',
    }
  },
  {
    name: '首页-资讯',
    page: 'pages/ShouYe/ZiXun/index',
    auth: ['avatar'],
    track: {
      event: 'list',
      eventType: 'news',
    }
  }
]

const Property = [
  {
    name: '物业',
    page: 'pages/WuYe/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'list',
      eventType: 'property',
    }
  },
  {
    name: '物业-服务分类列表',
    page: 'pages/WuYe/FuWuList/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'list',
      eventType: 'property',
    }
  },
  {
    name: '物业-公共服务列表',
    page: 'pages/WuYe/GongGongFuWu/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'list',
      eventType: 'property',
    }
  },
  {
    name: '物业-服务详情',
    page: 'pages/WuYe/FuWuDetail/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'property',
    }
  },
  {
    name: '物业-公告详情',
    page: 'pages/WuYe/GongGaoDetail/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'property',
    }
  },
  {
    name: '物业-报修区域',
    page: 'pages/WuYe/BaoXiuQuYu/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'property',
    }
  },
  {
    name: '物业-添加报修',
    page: 'pages/WuYe/TianJiaBaoXiu/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'property',
    }
  },
  {
    name: '物业-报修详情',
    page: 'pages/WuYe/BaoXiuDetail/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'property',
    }
  },
  {
    name: '物业-编辑报修',
    page: 'pages/WuYe/XiuGaiBaoXiu/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'property',
    }
  },
  {
    name: '物业-报修费用',
    page: 'pages/WuYe/BaoXiuFeiYong/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'property',
    }
  },
  {
    name: '物业-缴费详情',
    page: 'pages/WuYe/JiaoFeiDetail/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'property',
    }
  },
  {
    name: '物业-生活管家',
    page: 'pages/WuYe/ShengHuoGuanJia/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'property',
    }
  },
  {
    name: '物业-业主报修',
    page: 'pages/WoDe/YeZhuBaoXiu/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'property',
    }
  },
]

const Activity = [
  {
    name: '活动',
    page: 'pages/HuoDong/index',
    auth: ['avatar', 'yezhu'],
    track: {
      event: 'list',
      eventType: 'activity',
    }
  },
  {
    name: '活动-活动详情',
    page: 'pages/HuoDong/HuoDongDetail/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'activity',
    }
  },
  {
    name: '活动-活动签到',
    page: 'pages/HuoDong/HuoDongSign/index',
    auth: ['avatar', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'activity',
    }
  },
  {
    name: '活动-资讯详情',
    page: 'pages/HuoDong/ZiXunDetail/index',
    auth: ['avatar'],
    track: {
      event: 'detail',
      eventType: 'news',
    }
  }
]

const Shop = [
  {
    name: '福利',
    page: 'pages/FuLi/index',
    auth: ['avatar', 'yezhu'],
    track: {
      event: 'list',
      eventType: 'shop',
    }
  },
  {
    name: '福利搜索',
    page: 'pages/FuLi/ShangPinFilter/index',
    auth: ['avatar', 'yezhu'],
    track: {
      event: 'list',
      eventType: 'shop',
    }
  },
  {
    name: '福利-商品详情',
    page: 'pages/FuLi/ShangPinXiangQing/index',
    auth: ['avatar', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'shop',
    }
  },
  {
    name: '福利-商品兑换',
    page: 'pages/FuLi/ShangPinDuiHuan/index',
    auth: ['avatar', 'yezhu'],
    track: {
      event: 'exchange',
      eventType: 'shop',
    }
  },
  {
    name: '福利-积分规则',
    page: 'pages/FuLi/JiFenGuiZe/index',
    auth: ['avatar', 'yezhu'],
    track: {
      event: 'points_rule',
      eventType: 'shop',
    }
  },
  {
    name: '福利-积分明细',
    page: 'pages/FuLi/JiFenMingXi/index',
    auth: ['avatar', 'yezhu'],
    track: {
      event: 'points_details',
      eventType: 'shop',
    }
  }
]

const Other = [
  {
    name: '我的',
    page: 'pages/WoDe/index',
    auth: ['avatar'],
    track: {
      event: 'list',
      eventType: 'other',
    }
  },
  {
    name: '我的-个人信息',
    page: 'pages/WoDe/GeRenXinXi/index',
    auth: ['avatar', 'phone'],
    track: {
      event: 'detail',
      eventType: 'other',
    }
  },
  {
    name: '我的-我的认证',
    page: 'pages/WoDe/WoDeRenZheng/index',
    auth: ['avatar', 'phone', 'yezhu'],
    type: 'other',
  },
  {
    name: '我的-业主认证',
    page: 'pages/WoDe/YeZhuRenZheng/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'property',
    },
    isYeZhuRenZheng: true,
  },
  {
    name: '我的-业主审核',
    page: 'pages/WoDe/YeZhuShenHe/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'property',
    }
  },
  {
    name: '我的-物业缴费',
    page: 'pages/WoDe/WoDeJiaoFei/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'property',
    }
  },
  {
    name: '我的-物业服务',
    page: 'pages/WoDe/WoDeGongDan/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'property',
    }
  },
  {
    name: '我的-我的活动',
    page: 'pages/WoDe/WoDeHuoDong/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'list',
      eventType: 'activity',
    }
  },
  {
    name: '我的-推荐二维码',
    page: 'pages/WoDe/TuiJianErWeiMa/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'other',
    }
  },
  {
    name: '我的-推荐分享',
    page: 'pages/WoDe/TuiJianFenXiang/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'detail',
      eventType: 'other',
    }
  },
  {
    name: '我的-我的订单',
    page: 'pages/WoDe/WoDeDingDan/index',
    auth: ['avatar', 'phone', 'yezhu'],
    track: {
      event: 'list',
      eventType: 'other',
    }
  },
]

module.exports = [
  ...Main,
  ...Property,
  ...Activity,
  ...Shop,
  ...Other
]
