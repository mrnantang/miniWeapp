const isH5 = process.env.TARO_ENV === 'h5'

export default {
  pages: isH5
    ? [
        'pages/pdf-viewer/index',
      ]
    : [
        'pages/login/index',
      ],
  subPackages: isH5
    ? []
    : [
        {
          root: 'subpackages/dev',
          pages: ['home/index', 'leads/index', 'leads/add-lead/index', 'leads/detail/index', 'leads/assign/index', 'opportunity/index', 'opportunity/detail/index', 'customer/index', 'quote/index', 'quote/detail/index', 'mine/index', 'mine/notice/index', 'mine/product/index', 'mine/product/detail/index', 'mine/order/index', 'mine/order/detail/index', 'mine/reimburse/index', 'mine/reimburse/add/index', 'mine/reimburse/detail/index', 'mine/expense/index', 'mine/expense/detail/index', 'mine/perf/index', 'mine/perf/add/index', 'mine/perf/detail/index', 'customer/add-customer/index', 'customer/detail/index', 'customer/perf-detail/index', 'contract/index', 'contract/detail/index']
        },
        { root: 'subpackages/ops', pages: ['home/index', 'leads/index', 'content/index', 'content/add/index', 'content/detail/index', 'mine/index', 'mine/material/index', 'mine/material/add/index', 'mine/material/detail/index'] },
        { root: 'subpackages/boss', pages: ['mine/index', 'ops-home/index', 'sales-home/index', 'dev-home/index'] },
      ],
  preloadRule: isH5 ? {} : {
    'pages/login/index': {
      network: 'all',
      packages: ['subpackages/dev']
    }
  },
  permission: {
    'scope.userLocation': {
      desc: '用于签到打卡获取您的位置信息'
    }
  },
  requiredPrivateInfos: ['getLocation'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '',
    navigationBarTextStyle: 'black'
  }
}
