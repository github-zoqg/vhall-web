import Vue from 'vue'
import VueRouter from 'vue-router';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import { checkAuth } from "@/utils/utils"; // progress bar style
Vue.use(VueRouter);
// 所有路由数组
const routes = [];
// 动态加载路由
const modulesFiles = require.context('./modules', true, /\.js$/);
modulesFiles.keys().map((modulePath) => {
  routes.push(...modulesFiles(modulePath).default);
});

const base = (process.env.VUE_APP_NODE_ENV === 'production' || process.env.VUE_APP_NODE_ENV === 'test') ? '/v3/' : '/'
const createRouter = () => new VueRouter({
  mode: 'history',
  base,
  routes
});
const router = createRouter();
NProgress.configure({showSpinner: false}); // NProgress Configuration
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
router.beforeEach((to, from, next) => {
  checkAuth(to, from, next);
});
router.afterEach(() => {
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
