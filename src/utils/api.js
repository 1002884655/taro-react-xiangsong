const prefix = `${HOST}/api/wx`

const $api = {
  EditUserInfo: { // 修改用户信息
    method: 'put',
    url: `${prefix}/editPerson`
  },
  GetCommentList: { // 获取留言板列表
    method: 'get',
    url: `${prefix}/message-board`
  },
  SendComment: { // 提交留言
    method: 'post',
    url: `${prefix}/message-board`
  },
  GetActivityInfoByScene: { // 通过scene获取活动详情
    method: 'get',
    url: `${prefix}/qrcode/scene/:sceneId`
  },
  GetCommunityList: { // 获取小区列表
    method: 'get',
    url: `${prefix}/tpCommunity`
  },
  ReplyTicket: { // 工单回复
    method: 'post',
    url: `${prefix}/ticket/reply/:orgId`
  },
  PostGongDanPingJia: { // 工单评价
    method: 'post',
    url: `${prefix}/accessTicket/:orgId`
  },
  getGuanJiaGongDanList: { // 获取管家工单列表
    method: 'get',
    url: `${prefix}/life/ticket/list`
  },
  getUserChangePrizeList: { // 兑换商品记录
    method: 'get',
    url: `${prefix}/taPointsExchange`
  },
  PostOwnerScore: { // 用户给生活管家评分
    method: 'post',
    url: `${prefix}/tpLifeConsultantEvaluate`
  },
  activitySign: { // 活动签到
    method: 'put',
    url: `${prefix}/buildingDynamicCheckin/:id`
  },
  getIndexAdv: { // 获取首页广告
    method: 'get',
    url: `${prefix}/extendContent`
  },
  getJiFenRecords: { // 获取积分明细
    method: 'get',
    url: `${prefix}/taPointsRecords`
  },
  getUserInfo: { // 获取用户信息
    method: 'get',
    url: `${prefix}/user/info`
  },

  getTpNewsList: {
    method: 'get',
    url: `${prefix}/tpNewsType/list`
  },

  getWuYeFuWuDetail: { // 获取物业服务详情
    method: 'get',
    url: `${prefix}/property-news/:id`
  },
  getWuYeFuWuList: { // 获取物业服务列表
    method: 'get',
    url: `${prefix}/property-news`
  },
  uploadImage: { // 上传图片
    method: 'post',
    url: `${prefix}/image`
  },
  getMessageList: { // 获取小区通知
    method: 'get',
    url: `${prefix}/message/:orgId/news`
  },
  getRenZhengDetail: { // 获取认证详情
    method: 'get',
    url: `${prefix}/user/verify/:id`
  },
  userSign: { // 用户签到
    method: 'post',
    url: `${prefix}/user/signin`
  },
  deleteCheckingRenZheng: { // 删除审核中的房产
    method: 'delete',
    url: `${prefix}/user/verify/delete/:id`
  },
  deletePassRenZheng: { // 删除审核通过的房产
    method: 'delete',
    url: `${prefix}/current_user/verify/delete/:id`
  },
  getOwnerVerifyList: { // 获取业主认证列表
    method: 'get',
    url: `${prefix}/user/verify/list`
  },
  addOwnerVerify: { // 添加业主认证
    method: 'post',
    url: `${prefix}/user/verify/add`
  },
  checkOwnerVerify: { // 校验业主是否认证某房产
    method: 'get',
    url: `${prefix}/building/has`
  },
  checkPhoneCode: { // 校验手机验证码
    method: 'post',
    url: `${prefix}/check/captcha`
  },
  getPhoneCode: { // 获取手机验证码
    method: 'post',
    url: `${prefix}/captcha`
  },
  getRenZhengAddressList: { // 获取认证业主房产选择联动列表
    method: 'get',
    url: `${prefix}/building/select/address`
  },
  getJiaoFeiList: { // 获取缴费列表
    method: 'get',
    url: `${prefix}/bills/current_user/:type`
  },
  getBillInvoiced: {
    method: 'get',
    url: `${prefix}/bill/:orgId/:id`
  },

  wxStartPay: {
    method: 'post',
    url: `${prefix}/wxStartPay`
  },

  wxCancelPay: {
    method: 'get',
    url: `${prefix}/wxCancelPay/:outTradeNo`
  },

  wxUnifiedOrder: {
    method: 'get',
    url: `${prefix}/wxUnifiedOrder/:outTradeNo`
  },

  getRepairTypeList: {
    method: 'get',
    url: `${prefix}/tpRepairType`
  },

  getRepairTypeDetail: {
    method: 'get',
    url: `${prefix}/tpRepairType/:id`
  },

  getShengHuoGuanJiaList: {
    method: 'get',
    url: `${prefix}/life-consultant/list`
  },

  getGongDanList: { // 获取小区工单列表
    method: 'get',
    url: `${prefix}/tickets/list/:orgId`
  },
  editGongDan: { // 修改工单
    method: 'post',
    url: `${prefix}/updateTicket/:id`
  },
  AddGongDan: { // 添加工单
    method: 'post',
    url: `${prefix}/addtpTicket`
  },
  getGongDanDetail: { // 获取工单详情
    method: 'get',
    url: `${prefix}/ticket/schedule/:orgId`
  },

  endTicket: {  // 管家结束工单
    method: 'post',
    url: `${prefix}/endTicket`
  },

  getWuYePhone: { // 获取物业电话
    method: 'get',
    url: `${prefix}/tels`
  },
  getGongGaoList: { // 获取小区公告列表
    method: 'get',
    url: `${prefix}/announcements/:orgId`
  },
  getGongGaoDetail: { // 获取小区公告详情
    method: 'get',
    url: `${prefix}/announcement/:orgId`
  },
  getUserPhone: { // 获取用户手机号
    method: 'post',
    url: `${prefix}/userPhone`
  },
  getActivityList: { // 获取活动列表
    method: 'get',
    url: `${prefix}/buildingDynamiceList`
  },
  checkActivityJoin: { // 查询活动参加详情
    method: 'get',
    url: `${prefix}/buildingDynamiceEnlistInfo/:id`
  },
  getActivityDetail: { // 获取活动详情
    method: 'get',
    url: `${prefix}/buildingDynamiceInfo/:id`
  },
  JoinActivity: { // 参加活动
    method: 'post',
    url: `${prefix}/activityDynamicEnlistAdd`
  },
  getJiFenRule: { // 获取积分规则
    method: 'get',
    url: `${prefix}/tdPointsRules`
  },
  getGoodsList: { // 获取商品列表
    method: 'get',
    url: `${prefix}/goods`
  },
  getGoodsDetail: { // 获取商品详情
    method: 'get',
    url: `${prefix}/goods/:id`
  },
  exchangeGoods: { // 兑换商品
    method: 'post',
    url: `${prefix}/goods/exchange/:id`
  },
  getNewsList: { // 获取资讯列表
    method: 'get',
    url: `${prefix}/taNews`
  },
  getNewsDetail: { // 获取资讯详情
    method: 'get',
    url: `${prefix}/taNews/:id`
  },
  addNewsViews: { // 资讯阅读量+1
    method: 'put',
    url: `${prefix}/taNews/pvNum/:id`
  },
  getBanner: { // 获取轮播图
    method: 'get',
    url: `${prefix}/extendContent/banner`
  },
  login: { // 登录
    method: 'post',
    url: `${prefix}/login`
  },
  saveShareFrom: {
    method: 'post',
    url: `${prefix}/share-person`
  },
  saveTracking: { // 埋点
    method: 'post',
    url: `${prefix}/taPersonVisitRecord`
  },
  updateTracking: { // 更新埋点
    method: 'put',
    url: `${prefix}/taPersonVisitRecord/:id`
  },
  setShare: { // 分享
    method: 'put',
    url: `${prefix}/:type/share/:id`
  },

  // 授权头像等基本信息
  userAutInfo: {
    method: 'post',
    url: `${prefix}/signup`
  },

  // 二维码
  qrcode: {
    method: 'post',
    url: `${prefix}/qrcode`
  }

}


export default $api