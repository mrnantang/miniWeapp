export default {
  pages: [
    'pages/login/index'
  ],
  subPackages: [
    {
      root: 'subpackages/dev',
      pages: ['home/index', 'task/index', 'mine/index']
    },
    {
      root: 'subpackages/sales',
      pages: ['home/index', 'mine/index']
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
      packages: ['subpackages/dev', 'subpackages/sales', 'subpackages/ops', 'subpackages/boss']
    }
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '',
    navigationBarTextStyle: 'black'
  }
}
