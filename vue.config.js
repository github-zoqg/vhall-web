const { debug } = require('console')
const path = require('path')
let cdn = {
  js: [
    '//static.vhallyun.com/jssdk/vhall-jssdk-player/latest/vhall-jssdk-player-2.3.0.js',
    '//static.vhallyun.com/jssdk/vhall-jssdk-vodupload/latest/vhall-jssdk-upload-2.0.2.js',
    '//static01-open.e.vhall.com/jssdk/vhall-jssdk-form/vhall-jssdk-form-1.0.3.js',
    '//static.vhallyun.com/jssdk/vhall-jssdk-base/vhall-msg-1.0.9.js',
    '//static.vhallyun.com/jssdk/vhall-jssdk-chat/latest/vhall-jssdk-chat-2.0.9.js',
    '//cnstatic01.e.vhall.com/vhall-new-saas/static/polyfill.js?v=202',
    '//static.vhallyun.com/jssdk/vhall-jssdk-doc/latest/vhall-jssdk-doc-3.1.6.js',
    '//s1.e.vhall.com/common-static/middle/vue/2.6.14/dist/vue.min.js',
    // '//cnstatic01.e.vhall.com/3rdlibs/common-libs/ui-frame/element-UI.js',
    '//s3.e.vhall.com/common-static/middle/questionnaire-web/1.0.8/questionnaire_service.js',
    '//cnstatic01.e.vhall.com/common-static/middle/vhall-ui/v1.1.0/index.js'
  ],
  css: [
    '//cnstatic01.e.vhall.com/common-static/middle/vhall-ui/v1.1.0/index.css'
  ]
}

if (process.env.NODE_ENV === 'development') {
  const vueIndex = cdn.js.findIndex(item => item.indexOf('vue.min.js') > -1)
  cdn.js.splice(vueIndex, 1, '//t-alistatic01.e.vhall.com/common-static/middle/vue/2.6.14/dist/vue.js')
}

// console.warn(process)
let publicPath = process.env.VUE_APP_PUBLIC_PATH || './'
console.warn('配置环境变量----', {
  // MODE: process.VUE_CLI_SERVICE,
  NODE_ENV: process.env.NODE_ENV,
  VUE_APP_NODE_ENV: process.env.VUE_APP_NODE_ENV,
  VUE_APP_WEB_URL: process.env.VUE_APP_WEB_URL,
  VUE_APP_BASE_URL: process.env.VUE_APP_BASE_URL,
})

module.exports = {
  lintOnSave: false,
  assetsDir: './static',
  publicPath: publicPath,
  devServer: {
    proxy: {
      '/mock': {
        target: 'http://yapi.vhall.domain',
        changeOrigin: true,
      },
      '/v3': {
        target: process.env.VUE_APP_BASE_URL,
        changeOrigin: true,
      },
      '/account': {
        target: process.env.VUE_APP_BASE_URL,
        changeOrigin: true,
      },
      // '/account': {
      //   target: 'http://t-saas-dispatch.vhall.com',
      //   changeOrigin: true
      // },
      '/api/upload': {
        target: 'http://test-zhike.vhall.com/',
        changeOrigin: true,
      },
      '/domian': {
        target: 'http://t-webinar.e.vhall.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/domian': '',
        },
      },
    },
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
  chainWebpack: (config) => {
    config.plugin('html').tap((options) => {
      options[0].cdn = cdn
      options[0].version = process.VUE_CLI_SERVICE.pkg.version
      return options
    })
    // config.plugin('webpack-bundle-analyzer')
    //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  },
  configureWebpack: (config) => {
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
      const externals = {
        vue: 'Vue',
        "vhall-ui": "VHALLUI"
      }
      return {
        // optimization,
        externals
      }
  //   } else {
  //     // 为开发环境修改配置...
  //   }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/common/css/common.less')],
    },
  },
}
