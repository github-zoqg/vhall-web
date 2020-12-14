const path = require('path');
let cdn = {
  js: [
    "//static.vhallyun.com/jssdk/vhall-jssdk-player/latest/vhall-jssdk-player-2.2.4-1.js",
    "//static.vhallyun.com/jssdk/vhall-jssdk-vodupload/latest/vhall-jssdk-upload-2.0.2.js",
    "//t-static01-open.e.vhall.com/jssdk/vhall-jssdk-form/vhall-jssdk-form-1.0.3.js",
    "//static.vhallyun.com/jssdk/vhall-jssdk-chat/latest/vhall-jssdk-chat-2.1.3.js",
    "//cnstatic01.e.vhall.com/vhall-new-saas/static/polyfill.js?v=202",
    "//static01-open.e.vhall.com/jssdk/question-component/1.0.3/questionnaire_service.js"
  ]
}

let publicPath = './'

switch (process.env.VUE_APP_NODE_ENV)  {
  case 'test':
    publicPath = '//t-alistatic01.e.vhall.com/saas-v3-web/static/'
    break;
  default :
    publicPath = './'
    break;
}


module.exports = {
  lintOnSave: false,
  assetsDir: './static',
  publicPath: process,
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
  chainWebpack: config=>{
    config.plugin('html').tap(options=>{
      options[0].cdn = cdn
      return options
    })
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/common/css/common.less')]
    }
  }
};
