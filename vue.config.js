const path = require('path');
// function resolve (dir) {
// return path.join(__dirname, dir)
// // }
/*
let publicPath = null;
switch (process.env.VUE_APP_NODE_ENV) {
  case 'production':
    publicPath = '//cnstatic01.e.vhall.com/saas-wap/';
    break;
  case 'test':
    publicPath = '//t-alistatic01.e.vhall.com/saas-wap/';
    break;
  case 'pre':
    publicPath = '//preview-static.e.vhall.com/saas-wap/';
    break;
  case 'development':
    publicPath = '/room/';
  // eslint-disable-next-line no-fallthrough
  default:
    publicPath = '/room/';
}*/
module.exports = {
  publicPath: './',
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
