const path = require('path');
const btool = require('./scripts/btool');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const vueURL = ['production', 'pre'].includes(process.env.VUE_APP_NODE_ENV)
  ? '//s1.e.vhall.com/common-static/middle/vue/2.6.14/dist/vue.min.js'
  : '//s1.e.vhall.com/common-static/middle/vue/2.6.14/dist/vue.js';
const UselessFile = require('useless-files-webpack-plugin');

let cdn = {
  js: [
    '//static.vhallyun.com/jssdk/vhall-jssdk-player/latest/vhall-jssdk-player-2.3.0.js',
    '//static.vhallyun.com/jssdk/vhall-jssdk-vodupload/latest/vhall-jssdk-upload-2.0.2.js',
    '//static01-open.e.vhall.com/jssdk/vhall-jssdk-form/vhall-jssdk-form-1.0.3.js',
    '//static.vhallyun.com/jssdk/vhall-jssdk-base/vhall-msg-1.0.9.js',
    '//static.vhallyun.com/jssdk/vhall-jssdk-chat/latest/vhall-jssdk-chat-2.0.9.js',
    '//cnstatic01.e.vhall.com/vhall-new-saas/static/polyfill.js?v=202',
    '//static.vhallyun.com/jssdk/vhall-jssdk-doc/latest/vhall-jssdk-doc-3.1.6.js',
    vueURL, // 必须在elementUI 之前
    '//cnstatic01.e.vhall.com/common-static/middle/vhall-ui/v2.0.2-beta/index.js', // vhallUI
    '//s1.e.vhall.com/common-static/middle/vue-i18n/8.26.7/vue-i18n.min.js', // VueI18n
    '//s1.e.vhall.com/common-static/middle/vue-router/3.5.3/dist/vue-router.min.js', // VueRouter
    '//s2.e.vhall.com/common-static/middle/dayjs/1.10.8/dayjs.min.js', // dayjs
    '//s1.e.vhall.com/common-static/middle/element-ui/lib/2.15.6/index.js', //elementUI
    '//s1.e.vhall.com/common-static/middle/lodash/4.17.21/lodash.min.js', // lodash
    '//s1.e.vhall.com/common-static/middle/echarts/4.9.0/echarts.min.js', // echarts
    '//s1.e.vhall.com/common-static/middle/middle-util/1.1.3/utils/index.min.js',
    '//s3.e.vhall.com/common-static/middle/questionnaire-web/1.0.10/questionnaire_service.js',
    // '//s3.e.vhall.com/common-static/middle/vhall-form/1.0.0-pre/vhall-form-vue.js'
    '//s3.e.vhall.com/common-static/vhall-form/1.0.0/vhall-form-vue.js'
  ],
  css: ['//cnstatic01.e.vhall.com/common-static/middle/vhall-ui/v2.0.2-beta/index.css']
};
// console.warn(process)
let publicPath = process.env.VUE_APP_PUBLIC_PATH || './';
console.warn('配置环境变量----', {
  // MODE: process.VUE_CLI_SERVICE,
  NODE_ENV: process.env.NODE_ENV,
  VUE_APP_NODE_ENV: process.env.VUE_APP_NODE_ENV,
  VUE_APP_WEB_URL: process.env.VUE_APP_WEB_URL,
  VUE_APP_BASE_URL: process.env.VUE_APP_BASE_URL
});

// 解析参数成key-value形式：
// {
//   _: ['serve'],
//   lob: 'demo',
//   project: 'live-pc',
//   mode: 'development'
// };
const argv = btool.parseArgv(process.argv);
console.warn('argv------>', argv);

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
        target: process.env.VUE_APP_BASE_URL,
        changeOrigin: true
      },
      '/account': {
        target: process.env.VUE_APP_BASE_URL,
        changeOrigin: true
      },
      // '/account': {
      //   target: 'http://t-saas-dispatch.vhall.com',
      //   changeOrigin: true
      // },
      '/api/upload': {
        target: 'http://test-zhike.vhall.com/',
        changeOrigin: true
      },
      '/domian': {
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
  chainWebpack: config => {
    config.plugin('html').tap(options => {
      options[0].cdn = cdn;
      options[0].version = process.VUE_CLI_SERVICE.pkg.version;
      options[0].gitlabHash = argv.hash; //gitlab jenkins对应的项目hash
      return options;
    });
    // config.plugin('webpack-bundle-analyzer')
    //   .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)

    // 打包缓存加速
    config.plugin('cache').use(HardSourceWebpackPlugin);
  },
  configureWebpack: config => {
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
      'vhall-ui': 'VHALLUI',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      lodash: '_',
      VueI18n: 'VueI18n',
      echarts: 'echarts'
    };
    const plugins = [];
    if (argv.checkunuse) {
      plugins.push(
        new UselessFile({
          root: './src', // 项目目录
          out: './fileList.json', // 输出文件列表
          // out: (files) => deal(files), // 或者回调处理
          clean: false // 删除文件,
          // exclude: path // 排除文件列表, 格式为文件路径数组
        })
      );
    }
    return {
      // optimization,
      externals,
      plugins
    };
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/common/css/common.less')]
    }
  }
};
