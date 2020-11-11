const path = require('path');
// function resolve (dir) {
// return path.join(__dirname, dir)
// // }
let publicPath = './';
switch (process.env.VUE_APP_NODE_ENV) {
  case 'production':
    publicPath = '//t-alistatic01.e.vhall.com/saas-v3-web/';
    break;
  case 'test':
    publicPath = '//t-alistatic01.e.vhall.com/saas-v3-web/';
    break;
  case 'pre':
    publicPath = '//t-alistatic01.e.vhall.com/saas-v3-web/';
    break;
  case 'development':
    publicPath = './';
  // eslint-disable-next-line no-fallthrough
  default:
    publicPath = './';
}
module.exports = {
  publicPath: publicPath,
  assetsDir: './static',
  // lintOnSave: false,
  devServer: {
    proxy: {
      '/mock': {
        target: 'http://yapi.vhall.domain',
        changeOrigin: true
      },
      '/account': {
        target: 'http://t.e.vhall.com/account',
        changeOrigin: true
      },
      '/api/upload':{
        target: 'https://test-zhike.vhall.com/',
        changeOrigin: true
      }
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/common/css/common.less')]
    }
  }
};
