const path = require('path')
const vueURL = process.env.NODE_ENV === 'production' ? '//s1.e.vhall.com/common-static/middle/vue/2.6.14/dist/vue.min.js' : '//t-alistatic01.e.vhall.com/common-static/middle/vue/2.6.14/dist/vue.js'

let cdn = {
  js: [
    '//static.vhallyun.com/jssdk/vhall-jssdk-player/latest/vhall-jssdk-player-2.3.0.js',
    '//static.vhallyun.com/jssdk/vhall-jssdk-vodupload/latest/vhall-jssdk-upload-2.0.2.js',
    '//static01-open.e.vhall.com/jssdk/vhall-jssdk-form/vhall-jssdk-form-1.0.3.js',
    '//static.vhallyun.com/jssdk/vhall-jssdk-base/vhall-msg-1.0.9.js',
    '//static.vhallyun.com/jssdk/vhall-jssdk-chat/latest/vhall-jssdk-chat-2.0.9.js',
    '//cnstatic01.e.vhall.com/vhall-new-saas/static/polyfill.js?v=202',
    '//static.vhallyun.com/jssdk/vhall-jssdk-doc/latest/vhall-jssdk-doc-3.1.6.js',
    // '//cnstatic01.e.vhall.com/3rdlibs/common-libs/vue/VhallLibs.js',
    '//s3.e.vhall.com/common-static/middle/questionnaire-web/1.0.4-beta.1/questionnaire_service.js', // 问卷sdk
    '//s1.e.vhall.com/common-static/middle/vue-i18n/8.26.7/vue-i18n.min.js', // VueI18n
    '//s1.e.vhall.com/common-static/middle/vue-router/3.5.3/dist/vue-router.min.js', // VueRouter
    '//s2.e.vhall.com/common-static/middle/dayjs/1.10.8/dayjs.min.js', // dayjs
    vueURL, // 必须在elementUI 之前
    '//s1.e.vhall.com/common-static/middle/element-ui/lib/2.15.6/index.js', //elementUI
    '//s1.e.vhall.com/common-static/middle/lodash/4.17.21/lodash.min.js', // lodash
    '//s1.e.vhall.com/common-static/middle/moment/2.29.1/dist/moment.min.js', // lodash
    '//s1.e.vhall.com/common-static/middle/echarts/4.9.0/echarts.min.js', // echarts
  ],
  css: [
    '//s1.e.vhall.com/common-static/middle/element-ui/lib/2.15.6/theme/index.css', //ElementUi
  ]
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
    config.plugin('webpack-bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
  },
  configureWebpack: () => {
    // const optimization = {
    //   splitChunks: {
    //     chunks: "all",
    //     cacheGroups: {
    //       defaultVendors: {
    //         test: /[\/]node_modules[\/]/,
    //         priority: -10,
    //         // name: "vendors",
    //       },
    //       // 三方依赖
    //       html2canvas: {
    //         test: /[\/]html2canvas[\/]/,
    //         priority: 10,
    //         // name: "html2canvas",
    //       },
    //       tinymce: {
    //         test: /[\/]tinymce[\/]/,
    //         priority: 10,
    //         // name: "tinymce",
    //       },
    //       echarts: {
    //         test: /[\/]echarts[\/]/,
    //         priority: 10,
    //         // name: "echarts",
    //       },
    //       vuescroll: {
    //         test: /[\/]vuescroll[\/]/,
    //         priority: 10,
    //         // name: "vuescroll",
    //       },
    //       jsencrypt: {
    //         test: /[\/]jsencrypt[\/]/,
    //         priority: 10,
    //         // name: "jsencrypt",
    //       }
    // 页面组件拆分
    // componetEditor: {
    //   test: /[\/]componet-editor[\/]/,
    //   priority: 20,
    //   // name: "live-module-componet-ditor",
    // },
    // customerTabview: {
    //   test: /[\/]LiveModule[\/]CustomerTabView[\/]/,
    //   priority: 15,
    //   // name: "live-module-customer-tabview",
    // },
    // materialSet: {
    //   test: /[\/]LiveModule[\/]MaterialSet[\/]/,
    //   priority: 15,
    //   // name: "live-module-material-set",
    // },
    // playBack: {
    //   test: /[\/]LiveModule[\/]PlayBack[\/]/,
    //   priority: 15,
    //   // name: "live-module-play-back",
    // },
    // brands: {
    //   test: /[\/]LiveModule[\/]Brands[\/]/,
    //   priority: 15,
    //   // name: "live-module-brands",
    // },
    // data: {
    //   test: /[\/]LiveModule[\/]Data[\/]/,
    //   priority: 15,
    //   // name: "live-module-data",
    // },
    // signUp: {
    //   test: /[\/]LiveModule[\/]signUp[\/]/,
    //   priority: 15,
    //   // name: "live-module-sign-up",
    // },
    // liveComponents: {
    //   test: /[\/]LiveModule[\/]components[\/]/,
    //   priority: 15,
    //   // name: "live-components",
    // },
    // livemodule: {
    //   test: /[\/]LiveModule[\/]/,
    //   priority: 10,
    //   // name: "live-module",
    // },
    // layout: {
    //   test: /[\/]src[\/]layout[\/]/,
    //   priority: 10,
    //   // name: "app-layout",
    // },
    // OldHeader: {
    //   test: /[\/]src[\/]components[\/]OldHeader[\/]/,
    //   priority: 15,
    //   // name: "app-components-old-header",
    // },
    // videoTailoring: {
    //   test: /[\/]src[\/]components[\/]VideoTailoring[\/]/,
    //   priority: 15,
    //   // name: "app-components-video-tailoring",
    // },
    // defaultGroup: {
    //   test: /[\/]src[\/]components[\/]DefaultGroup[\/]/,
    //   priority: 15,
    //   // name: "app-components-default-group",
    // },
    // appComponents: {
    //   test: /[\/]src[\/]components[\/]/,
    //   priority: 10,
    //   // name: "app-components",
    // }
    //     }
    //   }
    // }
    const externals = {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      lodash: '_',
      VueI18n: 'VueI18n',
      echarts: 'echarts'
    }
    return {
      // optimization,
      externals
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/common/css/common.less')],
    },
  },
}
