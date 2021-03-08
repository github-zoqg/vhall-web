const path = require('path');
let cdn = {
  js: [
    "//static.vhallyun.com/jssdk/vhall-jssdk-player/latest/vhall-jssdk-player-2.3.0.js",
    "//static.vhallyun.com/jssdk/vhall-jssdk-vodupload/latest/vhall-jssdk-upload-2.0.2.js",
    "//static01-open.e.vhall.com/jssdk/vhall-jssdk-form/vhall-jssdk-form-1.0.3.js",
    "//static.vhallyun.com/jssdk/vhall-jssdk-base/vhall-msg-1.0.9.js",
    "//static.vhallyun.com/jssdk/vhall-jssdk-chat/latest/vhall-jssdk-chat-2.0.9.js",
    "//cnstatic01.e.vhall.com/vhall-new-saas/static/polyfill.js?v=202",
    "//static.vhallyun.com/jssdk/vhall-jssdk-doc/latest/vhall-jssdk-doc-3.1.5.js",
    // '//cnstatic01.e.vhall.com/3rdlibs/common-libs/vue/VhallLibs.js',
    // '//cnstatic01.e.vhall.com/3rdlibs/common-libs/ui-frame/element-UI.js',
    // "//static01-open.e.vhall.com/jssdk/question-component/1.0.3/questionnaire_service.js",
  ]
}

let publicPath = null

switch (process.env.VUE_APP_NODE_ENV)  {
  case 'development':
    publicPath = '/'
    break;
  case 'test':
    publicPath = '//t-alistatic01.e.vhall.com/saas-v3-web/'
    break;
  case 'production':
    publicPath = '//cnstatic01.e.vhall.com/saas-v3-web/'
    break;
  default :
    publicPath = './'
    break;
}


module.exports = {
  lintOnSave: false,
  assetsDir: './static',
  publicPath: publicPath,
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
        target: 'http://t-saas-dispatch.vhall.com',
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
  // pwa: {
  //   iconPaths: {
  //     favicon32: 'favicon.ico',
  //     favicon16: 'favicon.ico',
  //     appleTouchIcon: 'favicon.ico',
  //     maskIcon: 'favicon.ico',
  //     msTileImage: 'favicon.ico'
  //   }
  // },
  chainWebpack: config=>{
    config.plugin('html').tap(options=>{
      options[0].cdn = cdn
      options[0].favicon = path.resolve('public/favicon.ico')
      return options
    })
    // config.plugin('webpack-bundle-analyzer')
    //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  },
  // configureWebpack: (config) => {
  //   if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      // const optimization = {
      //   splitChunks: {
      //     cacheGroups: {
      //       common: {
      //         name: 'chunk-common',
      //         minChunks: 2,
      //         priority: -20,
      //         chunks: 'all',
      //         reuseExistingChunk: true
      //       }
      //     }
      //   }
      // }
  //     const externals = {
  //       vue: 'Vue',
  //       'vue-router': 'VueRouter',
  //       vuex: 'Vuex',
  //       'element-ui': 'ELEMENT'
  //     }
  //     return {
  //       // optimization,
  //       externals
  //     }
  //   } else {
  //     // 为开发环境修改配置...
  //   }
  // },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/common/css/common.less')]
    }
  }
};
