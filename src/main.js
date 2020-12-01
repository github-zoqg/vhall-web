import Vue from 'vue';
import App from './App.vue';
import router from './router';
import EventBus from './utils/Events';
import { copy } from './utils/utils';
// element-ui 样式重置
import ElementUI from 'element-ui';
import '@/common/css/theme/index.css';
import '@/components/Icon/index';
import './permission';
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
Vue.prototype.$img = require('./common/images/small.png');

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

import tinymce from 'tinymce';
import VueTinymce from '@packy-tang/vue-tinymce';
//样式
import 'tinymce/skins/content/default/content.min.css';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'tinymce/skins/ui/oxide/content.min.css';
//主题
import 'tinymce/themes/silver';
//插件
import 'tinymce/plugins/image'; //图片插件
import 'tinymce/plugins/quickbars';//快速栏插件
import 'tinymce/plugins/fullscreen';//全屏插件
Vue.prototype.$tinymce = tinymce;
Vue.use(VueTinymce);

new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app');
