import Vue from 'vue'
import App from './App.vue';
import router from './router';
import VhallUI from 'vhall-ui';
import 'cropperjs/dist/cropper.css'
import Cookies from 'js-cookie'
// element-ui 样式重置
import vuescroll from 'vuescroll';
import PaasPort from '@vhall/paas-report-data'
import { sessionOrLocal, refreshToken } from './utils/utils';
import { loadMore, tooltipMove, clearEmoij } from '@/utils/directive';
import './utils/prototype'
import * as filters from './utils/filter';
import { getParams } from './utils/general';
import ElementUI from 'element-ui';
// css相关
import '@/common/css/theme/index.css';
import '@/components/Icon/index';
// 页面加载进度样式
import 'nprogress/nprogress.css';
// 系统通用重置样式
import '@/common/css/index.less';

// 自定义组件
import SPagination from '@/components/Spagination/main';
import tableList from '@/components/TableList/list';
import searchArea from '@/components/SearchArea/index';
import VhallDialog from '@/components/Dialog';
import VhallInput from '@/components/Input';
import { bu_appId } from './init-global/businessData';


/**
 * ???
 */
window.SAAS_V3_COL = {
  KEY_1: 'SAAS_V3_SON_VO', // 子账号个数
  KEY_2: 'SAAS_V3_PID', // 用户ID
  KEY_3: 'SAAS_V3_BASE64', // 控制台token
  KEY_4: 'SAAS_V3_UO', // 用户对象
};
// 微吼默认标题
window.SAAS_vhall_title = "微吼-直播,网络直播,视频直播,在线教育平台,视频直播平台,网络直播系统,中国最大的网络直播互动平台";



//-------------------------- 隔离(组件,指令,过滤器) --------------------------

Vue.component('SPagination', SPagination);
Vue.component('VhallDialog', VhallDialog); // 弹框
Vue.component('tableList', tableList);  // 表格区域
Vue.component('searchArea', searchArea); // 搜索区域
Vue.component('VhallInput', VhallInput); // input 重写
// 指令
Vue.directive('preventReClick', {    // 限制按钮重复点击
  inserted: function(el, binding) {
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
Vue.directive('preventReOneClick', {
  // 限制按钮重复点击
  inserted: function (el, binding) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true;
        setTimeout(() => {
          el.disabled = false;
        }, binding.value || 1000);
      }
    });
  }
});
// 过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);    //插入过滤器名和对应方法
});
// 插件
Vue.use(VhallUI)
Vue.use(ElementUI)
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
Vue.use(VueI18n);
Vue.use(loadMore);
Vue.use(tooltipMove);
Vue.use(clearEmoij);

// 大数据上报配置
Vue.use(PaasPort, {
  app_id: process.env.VUE_APP_SAAS_ENV_DESC ? bu_appId['test_new'] : process.env.VUE_APP_NODE_ENV === 'production' ? bu_appId['production'] : bu_appId['test'],
  pf: 8,
  noConsole: false,
  isProduction: process.env.VUE_APP_NODE_ENV === 'production' ? true : false
});

const i18n = new VueI18n({
 locale: ['en', 'cn'].includes(getParams('lang')) ? getParams('lang') : 'cn', // 语言标识
 messages: {
   cn: require('../src/common/js/lan/cn'),
   en: require('../src/common/js/lan/en')
 }
});
window.i18n = i18n;
//-------------------------- 隔离 (vue指令,过滤器,插件)--------------------------

//-------------------------- 隔离 (灰度)--------------------------
/**
 * @description 初始化添加缓存
 */
function clientToken(param) {
  let reg = new RegExp('[?&]' + param + '=([^&]*)[&$]*');
  let ret = (window.location.hash || window.location.search).match(reg);
  if (ret) {
    ret = decodeURIComponent(ret[1]);
  }
  return ret || '';
}

let pageGrayTag = clientToken('vhall_gray');
let userGrayId = Cookies.get('gray-id');

if (!userGrayId && pageGrayTag) {
  // 若当前未存储过gray-id，并且vhall_gray有标记页面需存储假gray，存储gray-id
  Cookies.set('gray-id', pageGrayTag, { expires: 30 });
  window.location.reload();
}
let clientTokenVal = clientToken('token');
if (clientTokenVal) {
  sessionOrLocal.set('token', clientTokenVal, 'localStorage');
  sessionOrLocal.set('tokenRefresh', new Date().getTime(), 'localStorage');
  sessionOrLocal.set('platform', clientToken('platform'), 'localStorage');
} else {
  if (
    window.location.pathname.indexOf('cMiddle') != -1 ||
    window.location.pathname.indexOf('special/detail') != -1
  ) {
    // console.log('什么都不处理')
  } else {
    // 如果是非免登录的情况，初次进入项目的时候刷新一次 token
    // console.log('刷新一次 token')
    refreshToken();
  }
}
let outUrlVal = clientToken('out_url');
if (outUrlVal) {
  sessionOrLocal.set('SAAS_V3_CTRL_OUT', outUrlVal, 'localStorage');
}
//-------------------------- 隔离 (灰度)--------------------------
/**
 * @description vue实例
 */
Vue.config.productionTip = false; // devtools

// 创建实例
window.vm = new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app');
