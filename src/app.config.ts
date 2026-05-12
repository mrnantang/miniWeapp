export default {
  pages: [
    'pages/login/index'
  ],
  subPackages: [
    {
      root: 'subpackages/dev',
      pages: ['home/index', 'leads/index', 'leads/add-lead/index', 'opportunity/index', 'opportunity/detail/index', 'customer/index', 'quote/index', 'mine/index', 'mine/notice/index', 'mine/product/index', 'mine/product/detail/index', 'mine/order/index', 'mine/order/detail/index', 'mine/reimburse/index', 'mine/reimburse/add/index', 'mine/reimburse/detail/index', 'mine/expense/index', 'mine/expense/detail/index', 'mine/perf/index', 'mine/perf/add/index', 'mine/perf/detail/index', 'customer/add-customer/index', 'customer/detail/index', 'customer/perf-detail/index', 'contract/index', 'contract/detail/index']
    },
    {
      root: 'subpackages/ops',
      pages: ['home/index', 'leads/index', 'content/index', 'content/add/index', 'content/detail/index', 'mine/index', 'mine/material/index']
    },
    {
      root: 'subpackages/boss',
      pages: ['overview/index', 'report/index', 'mine/index']
    }
  ],
  preloadRule: {
    'pages/login/index': {
      network: 'all',
      // packages: ['subpackages/dev', 'subpackages/ops', 'subpackages/boss']
      packages: ['subpackages/dev']
    }
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '',
    navigationBarTextStyle: 'black'
  }
}
