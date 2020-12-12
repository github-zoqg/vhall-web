const path = require('path');
module.exports = {
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
