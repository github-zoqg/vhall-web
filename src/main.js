import Vue from 'vue';
import App from './App.vue';
import router from './router';
// element-ui 样式重置
import ElementUI from 'element-ui';
import '@/common/css/theme/index.css';
Vue.use(ElementUI);

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
Vue.prototype.$EventBus = new Vue();
// import './permission';

// 组件扩展
import SPagination from '@/components/Spagination/main';
import tableList from '@/components/TableList/list';
import searchArea from '@/components/SearchArea/index';
import '@/components/RemoteScript';
Vue.component('SPagination',SPagination);
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
