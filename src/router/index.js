import Vue from 'vue'
import VueRouter from 'vue-router';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import { checkAuth } from "@/utils/utils"; // progress bar style
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

const base = (process.env.VUE_APP_NODE_ENV === 'production' || process.env.VUE_APP_NODE_ENV === 'test') ? '/v3/' : '/'
const createRouter = () => new VueRouter({
  mode: 'history',
  base,
  routes :[
    ...Home,
    ...Live,
    ...material,
    ...setting,
    ...userRoutes,
    ...v3
  ]
});
const router = createRouter();
NProgress.configure({showSpinner: false}); // NProgress Configuration
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
router.beforeEach((to, from, next) => {
  checkAuth(to, from, next, window.vm);
});
router.afterEach(() => {
  window.scrollTo(0,0);
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
