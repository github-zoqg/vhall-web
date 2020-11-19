import Vue from 'vue';
import App from './App.vue';
import router from './router';
import EventBus from './utils/Events';
import { copy } from './utils/utils';
// element-ui 样式重置
import ElementUI from 'element-ui';
import '@/common/css/theme/index.css';
import '@/components/Icon/index';
// 七巧板组件库，直播间内使用
import vhallSaas from './tangram/buTemplates/index.js';
Vue.use(ElementUI);
Vue.use(vhallSaas, {
  config: {
    playbill: [`/api/webinar/v1/webinar/adv-info`, 'POST'] // 开屏海报
  },
  baseUrl: "https://d-vss.vhall.com",
  buHost: "https://t.e.vhall.com"
});
// 页面加载进度样式
import 'nprogress/nprogress.css';

// 系统通用重置样式
import '@/common/css/index.less';


// 工具类引入
import moment from 'moment'; // 日期格式化
import { getParams } from './utils/general';
import fetchData from './api/fetch';
Vue.prototype.$fetch = fetchData;
Vue.prototype.$moment = moment;
Vue.config.productionTip = false;
Vue.prototype.$EventBus = EventBus;
Vue.prototype.$copyText = copy;

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
new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app');
