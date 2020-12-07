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
console.log( publicPath, process.env.VUE_APP_NODE_ENV);
module.exports = {
  publicPath: publicPath,
  assetsDir: './static', // 设置放置打包生成的静态资源 (js、css、img、fonts) 的目录。
  lintOnSave: false,
  devServer: {
    proxy: {
      '/mock': {
        target: 'http://yapi.vhall.domain',
        changeOrigin: true
      },
      '/v3': {
        target: 'http://t-saas-dispatch.vhall.com',
        changeOrigin: true
      },
      '/account': {
        target: 'http://t.e.vhall.com/account',
        changeOrigin: true
      },
      '/api/upload':{
        target: 'http://test-zhike.vhall.com/',
        changeOrigin: true
      },
      '/domian':{
        target: 'http://t-webinar.e.vhall.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/domian': ''
        }
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
