import Vue from 'vue'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import { checkAuth } from "@/utils/utils"; // progress bar style
import ssoAutoLogin from '@/utils/ssoAutoLogin'
const isDev = process.env.NODE_ENV == 'development' // 当前是否为开发环境

Vue.use(VueRouter);
// 所有路由数组
const routes = [];
// 动态加载路由
// const modulesFiles = require.context('./modules', true, /\.js$/);
// modulesFiles.keys().map((modulePath) => {
//   routes.push(...modulesFiles(modulePath).default);
// });

import Home from './modules/home'
import Live from './modules/liveOrSpecial'
import material from './modules/material'
import setting from './modules/settingOrData'
import userRoutes from './modules/user'
import v3 from './modules/v3Sys'



const envList = [
  'production',
  'pre',
  'test',
  'new_test',
  'test_zt',
  'test4',
  'test5',
  'test6'
]
const base = envList.includes(process.env.VUE_APP_NODE_ENV) ? '/v3/' : '/'
console.log(`路由地址base=${base}`)
const createRouter = () => new VueRouter({
  mode: 'history',
  base,
  routes: [
    ...Home,
    ...Live,
    ...material,
    ...setting,
    ...userRoutes,
    ...v3
  ]
});
const router = createRouter();
NProgress.configure({ showSpinner: false }); // NProgress Configuration
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
router.beforeEach(async (to, from, next) => {
  // 控制单没有gray-init 先执行自动登录校验
  if (!isDev) {
    await ssoAutoLogin()
  }
  // 每次切换页面都先重置下页面title
  if (to.meta.name == "chooseWay" && to.meta.level == undefined) {
    // 如果是邀请的链接
    document.title = "";
  } else if (to.meta.name == "userHome" && to.meta.level == undefined) {
    // 如果是个人首页
    document.title = "";
  } else if (to.meta.name == "specialDetail" && to.meta.level == undefined) {
    // 如果是个人专题详情
    document.title = "";
  } else {
    document.title = window.SAAS_vhall_title;
  }
  checkAuth(to, from, next, window.vm);
});
router.afterEach(() => {
  window.scrollTo(0, 0);
  NProgress.done();
});
console.log('routerer');
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;// reset router
}
export {
  routes
};
export default router;
