import Vue from 'vue';
import App from './App.vue';
import router from './router';
import moment from 'moment';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import '@/common/css/theme/index.css';

import { getParams } from './utils/general';
import '@/common/css/index.less';

import fethData from './api/fetch';
import VueI18n from 'vue-i18n';
import SPagination from '@/components/Spagination/main';
Vue.use(ElementUI);
Vue.use(VueI18n);
// Vue.use(moment);
Vue.component('SPagination',SPagination);
Vue.prototype.$fetch = fethData;
Vue.prototype.$moment = moment;
Vue.config.productionTip = false;
const i18n = new VueI18n({
  locale: ['en', 'cn'].includes(getParams('lang')) ? getParams('lang') : 'cn', // 语言标识
  messages: {
    cn: require('../src/common/js/lan/cn'),
    en: require('../src/common/js/lan/en')
  }
});
new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app');
