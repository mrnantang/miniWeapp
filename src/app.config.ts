export default {
  pages: [
    'pages/login/index'
  ],
  subPackages: [
    {
      root: 'subpackages/dev',
      pages: ['home/index', 'leads/index', 'leads/add-lead/index', 'opportunity/index', 'customer/index', 'mine/index']
    },
    {
      root: 'subpackages/ops',
      pages: ['dashboard/index', 'content/index', 'mine/index']
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
