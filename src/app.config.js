const pages = require('./pages')

export default {
  pages: pages.map(x => x.page),
  tabBar: {
    color: '#666666',
    selectedColor: '#971C21',
    list: [
      {
        iconPath: 'assets/img/tabicon1.png',
        selectedIconPath: 'assets/img/tabicon1-.png',
        pagePath: 'pages/ShouYe/index',
        text: '首页'
      },
      {
        iconPath: 'assets/img/tabicon2.png',
        selectedIconPath: 'assets/img/tabicon2-.png',
        pagePath: 'pages/WuYe/index',
        text: '物业'
      },
      {
        iconPath: 'assets/img/tabicon3.png',
        selectedIconPath: 'assets/img/tabicon3-.png',
        pagePath: 'pages/HuoDong/index',
        text: '活动'
      },
      {
        iconPath: 'assets/img/tabicon4.png',
        selectedIconPath: 'assets/img/tabicon4-.png',
        pagePath: 'pages/FuLi/index',
        text: '福利'
      },
      {
        iconPath: 'assets/img/tabicon5.png',
        selectedIconPath: 'assets/img/tabicon5-.png',
        pagePath: 'pages/WoDe/index',
        text: '我的'
      }
    ]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
