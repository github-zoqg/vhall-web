import Vue from 'vue'

import App from './App.vue';
import router from './router';

import clipboard from 'clipboard'
// import VueTinymce from '@packy-tang/vue-tinymce/src/main';

import vuescroll from 'vuescroll';
import PaasPort from '@vhall/paas-report-data'

import { refreshToken } from './utils/utils'

// You can set global config here.
Vue.use(vuescroll, {
  ops: {
    // The global config
    bar: {
      background: 'rgba(0,0,0,0.3)'
    },
    /* scrollPanel: {
      initialScrollY: '100%'
    } */
  },
  name: 'vhscroll' // customize component name, default -> vueScroll
});
Vue.prototype.$clipboard = clipboard



import EventBus from './utils/Events';
import {copy, dealObjectValue, domainCovert, parseURL, checkUploadType, sessionOrLocal} from './utils/utils';
// element-ui 样式重置
import ELEMENT from 'element-ui';
import '@/common/css/theme/index.css';
import '@/components/Icon/index';
// 七巧板组件库，直播间内使用
// import vhallSaas from './tangram/buTemplates/index.js';
// 页面加载进度样式
import 'nprogress/nprogress.css';
// 系统通用重置样式
import '@/common/css/index.less';
import { loadMore, tooltipMove, clearEmoij }  from '@/utils/directive';

//过滤器
import * as filters from './utils/filter';

// 工具类引入
import moment from 'moment'; // 日期格式化
import 'moment/locale/zh-cn';

import { getParams } from './utils/general';
import fetchData from './api/fetch';
import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'

if(process.env.VUE_APP_NODE_ENV == 'production') {
  Sentry.init({
    dsn: 'https://f283305b06764042a899319546d60581@fe-log.vhall.com/29',
    logErrors: true,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })]
  })
} else if (process.env.VUE_APP_NODE_ENV == 'test') {
  Sentry.init({
    dsn: 'https://40c39d3d012e41f3a20e9765545d28c2@test-sentry.vhall.com/22',
    logErrors: true,
    integrations: [new Integrations.Vue({ Vue, attachProps: true })]
  })
}
window.test = sessionOrLocal
Vue.prototype.$fetch = fetchData;
Vue.prototype.$moment = moment;
Vue.config.productionTip = false;
Vue.prototype.$EventBus = EventBus;
Vue.prototype.$copyText = copy;
Vue.prototype.$params = dealObjectValue; //去除空值参数转换
Vue.prototype.$domainCovert = domainCovert;// 添加域名
Vue.prototype.$parseURL = parseURL; // 去除域名//*/upload/
Vue.prototype.$img = require('./common/images/small.png');
Vue.prototype.$checkUploadType = checkUploadType; // 验证上传格式
Vue.use(ELEMENT);
import './utils/message';
// Vue.use(vhallSaas, {
//   config: {
//     playbill: [`/api/webinar/v1/webinar/adv-info`, 'POST'] // 开屏海报
//   },
//   baseUrl: process.env.VUE_APP_BASE_URL,
//   buHost: "https://e.vhall.com"
// });

moment.locale(); // zh-cn
window.mom = moment

Object.keys(filters).forEach(key=>{
  Vue.filter(key, filters[key]);    //插入过滤器名和对应方法
});


window.SAAS_V3_COL = {
  KEY_1: 'SAAS_V3_SON_VO', // 子账号个数
  KEY_2: 'SAAS_V3_PID', // 用户ID
  KEY_3: 'SAAS_V3_BASE64', // 控制台token
  KEY_4: 'SAAS_V3_UO', // 用户对象
};

// 微吼默认标题
window.SAAS_vhall_title = "微吼-直播,网络直播,视频直播,在线教育平台,视频直播平台,网络直播系统,中国最大的网络直播互动平台";

// 组件扩展
import SPagination from '@/components/Spagination/main';
import tableList from '@/components/TableList/list';
import searchArea from '@/components/SearchArea/index';
import VhallDialog from '@/components/Dialog';
import VhallInput from '@/components/Input';

Vue.component('SPagination',SPagination);
Vue.component('VhallDialog',VhallDialog); // 弹框
Vue.component('tableList',tableList);  // 表格区域
Vue.component('searchArea',searchArea); // 搜索区域
Vue.component('VhallInput',VhallInput); // input 重写
Vue.directive('preventReClick', {    // 限制按钮重复点击
  inserted: function (el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
        }, binding.value || 3000);
      }
    });
  }
});
// 国际化
import VueI18n from 'vue-i18n';
import Cookies from 'js-cookie'

Vue.use(VueI18n);
Vue.use(loadMore)
Vue.use(tooltipMove)
Vue.use(clearEmoij)
Vue.use(PaasPort, {
  app_id: process.env.VUE_APP_NODE_ENV === 'production' ? '15df4d3f' : 'fd8d3653',
  pf: 8,
  noConsole: false,
  isProduction: process.env.VUE_APP_NODE_ENV === 'production' ? true : false
})
const i18n = new VueI18n({
  locale: ['en', 'cn'].includes(getParams('lang')) ? getParams('lang') : 'cn', // 语言标识
  messages: {
    cn: require('../src/common/js/lan/cn'),
    en: require('../src/common/js/lan/en')
  }
});
window.i18n = i18n;

// Vue.prototype.$tinymce = tinymce;
// Vue.use(VueTinymce);

function clientToken(param) {
  let reg = new RegExp('[?&]' + param + '=([^&]*)[&$]*');
  let ret = (window.location.hash || window.location.search).match(reg);
  if (ret) {
    ret = decodeURIComponent(ret[1]);
  }
  return ret || '';
}

let pageGrayTag = clientToken('vhall_gray')
let userGrayId = Cookies.get('gray-id')
if (!userGrayId && pageGrayTag) {
  // 若当前未存储过gray-id，并且vhall_gray有标记页面需存储假gray，存储gray-id
  Cookies.set('gray-id', pageGrayTag)
  window.location.reload()
}

let clientTokenVal = clientToken('token');
if(clientTokenVal) {
  sessionOrLocal.set('token', clientTokenVal , 'localStorage');
  sessionOrLocal.set('tokenRefresh', new Date().getTime(), 'localStorage')
  sessionOrLocal.set('platform', clientToken('platform'), 'localStorage');
} else {
  if (window.location.pathname.indexOf('cMiddle') != -1 || window.location.pathname.indexOf('special/detail') != -1) {
    // console.log('什么都不处理')
  } else {
    // 如果是非免登录的情况，初次进入项目的时候刷新一次 token
    // console.log('刷新一次 token')
    refreshToken()
  }
}
let outUrlVal = clientToken('out_url');
if(outUrlVal) {
  sessionOrLocal.set('SAAS_V3_CTRL_OUT', outUrlVal , 'localStorage');
}
window.vm = new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app');
