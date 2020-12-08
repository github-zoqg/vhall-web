import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
Vue.use(Router);
// 所有路由数组
const routes = [];
// 动态加载路由
const modulesFiles = require.context('./modules', true, /\.js$/);
modulesFiles.keys().map((modulePath) => {
  const value = modulesFiles(modulePath);
  //判断是否为数组路由
  if(value.default.length || value.default.length ===0){
    routes.push(...value.default);
  }else{
    routes.push(value.default);
  }
});
const createRouter = () => new Router({
  routes
});
const router = createRouter();
NProgress.configure({showSpinner: false}); // NProgress Configuration
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  next();
});
router.afterEach(() => {
  NProgress.done();
});
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;// reset router
}
export {
  routes
};
export default router;
