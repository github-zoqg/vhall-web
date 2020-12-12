import Vue from 'vue';
import App from './App.vue';
import router from './router';
import tinymce from 'tinymce';
import VueTinymce from '@packy-tang/vue-tinymce';
//样式
import 'tinymce/skins/content/default/content.min.css';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
//主题
import 'tinymce/themes/silver';
import 'tinymce/icons/default/icons.min.js';
//插件
import 'tinymce/plugins/image'; //图片插件
import 'tinymce/plugins/quickbars';//快速栏插件
import 'tinymce/plugins/fullscreen';//全屏插件

import EventBus from './utils/Events';
import baseObj from './api/env'
import {copy, dealObjectValue, domainCovert, parseURL, sessionOrLocal} from './utils/utils';
// element-ui 样式重置
import ElementUI from 'element-ui';
import '@/common/css/theme/index.css';
import '@/components/Icon/index';
// 七巧板组件库，直播间内使用
import vhallSaas from './tangram/buTemplates/index.js';
// 页面加载进度样式
import 'nprogress/nprogress.css';
// 系统通用重置样式
import '@/common/css/index.less';

//过滤器
import * as filters from './utils/filter';

// 工具类引入
import moment from 'moment'; // 日期格式化
import 'moment/locale/zh-cn';

import { getParams } from './utils/general';
import fetchData from './api/fetch';

Vue.prototype.$fetch = fetchData;
Vue.prototype.$moment = moment;
Vue.config.productionTip = false;
Vue.prototype.$EventBus = EventBus;
Vue.prototype.$copyText = copy;
Vue.prototype.$params = dealObjectValue; //去除空值参数转换
Vue.prototype.$domainCovert = domainCovert;// 添加域名
Vue.prototype.$parseURL = parseURL; // 去除域名//*/upload/
Vue.prototype.$img = require('./common/images/small.png');

Vue.use(ElementUI);
Vue.use(vhallSaas, {
  config: {
    playbill: [`/api/webinar/v1/webinar/adv-info`, 'POST'] // 开屏海报
  },
  baseUrl: baseObj.BASE_URL,
  buHost: "https://t.e.vhall.com"
});

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
  SYS_URL: baseObj
};
// 组件扩展
import SPagination from '@/components/Spagination/main';
import tableList from '@/components/TableList/list';
import searchArea from '@/components/SearchArea/index';
import VhallDialog from '@/components/Dialog';
import '@/components/RemoteScript';
Vue.component('SPagination',SPagination);
Vue.component('VhallDialog',VhallDialog); // 弹框
Vue.component('tableList',tableList);  // 表格区域
Vue.component('searchArea',searchArea); // 搜索区域
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
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: ['en', 'cn'].includes(getParams('lang')) ? getParams('lang') : 'cn', // 语言标识
  messages: {
    cn: require('../src/common/js/lan/cn'),
    en: require('../src/common/js/lan/en')
  }
});
window.i18n = i18n;

Vue.prototype.$tinymce = tinymce;
Vue.use(VueTinymce);



function clientToken(param) {
  let reg = new RegExp('[?&]' + param + '=([^&]*)[&$]*');
  let ret = window.location.hash.match(reg);
  if (ret) {
    ret = decodeURIComponent(ret[1]);
  }
  return ret || '';
}
let clientTokenVal = clientToken('token');
if(clientTokenVal) {
  sessionOrLocal.set('token', clientTokenVal , 'localStorage');
  sessionOrLocal.set('platform', clientToken('platform'), 'localStorage');
}
new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app');
