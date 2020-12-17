import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'
import fetchData from "@/api/fetch";
import {sessionOrLocal, getQueryString} from "@/utils/utils"; // progress bar style
Vue.use(Router);
// 所有路由数组
const routes = [];
// 动态加载路由
const modulesFiles = require.context('./modules', true, /\.js$/);

modulesFiles.keys().map((modulePath) => {
  routes.push(...modulesFiles(modulePath).default);
});

const base = (process.env.VUE_APP_NODE_ENV === 'production' || process.env.VUE_APP_NODE_ENV === 'test') ? '/v3/' : '/'

const createRouter = () => new Router({
  mode: 'history',
  base,
  routes
});
const router = createRouter();
NProgress.configure({showSpinner: false}); // NProgress Configuration
const whiteList = ['/login', '/register', '/forgetPassword', '/keylogin-host', '/keylogin']; // 白名单，不需携带Token
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
router.beforeEach((to, from, next) => {
  // NProgress.start();
  // next();
  let token = sessionOrLocal.get('token', 'localStorage') || '';
  if (token) {
    fetchData('planFunctionGet', {}).then(res => {
      if(res && res.code === 200) {
        let permissions = res.data.permissions;
        if(permissions) {
          sessionOrLocal.set('SAAS_VS_PES', permissions, 'localStorage');
        } else {
          sessionOrLocal.removeItem('SAAS_VS_PES');
        }
      }
    }).catch(e => {
      console.log(e);
      sessionOrLocal.removeItem('SAAS_VS_PES');
    });
    // 已登录不准跳转登录页
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
      return;
    }
    // 获取用户信息
    fetchData('getInfo', {scene_id: 2}).then(res => {
      // debugger;
      if(res.code === 200) {
        sessionOrLocal.set('userInfo', JSON.stringify(res.data));
        sessionOrLocal.set('userId', JSON.stringify(res.data.user_id));
      } else {
        sessionOrLocal.set('userInfo', null);
      }
      // 获取子账号数据
      fetchData('sonCountGet', {}).then(result => {
        if( result && result.code === 200) {
          sessionOrLocal.set(SAAS_V3_COL.KEY_1, JSON.stringify(result.data || {}));
        }
      }).catch(e=> {});
      next();
    }).catch(e=>{
      console.log(e);
      NProgress.done();
    });
  } else {
    // token不存在时跳转
    console.log('4444444', to.path, '当前页面');
    /**
     * 获取用户信息需要判断是普通登录还是第三方登录
     * 普通登录直接获取用户信息
     * 第三方登录地址栏有user_auth_key
     */
    if(
      whiteList.includes(to.path) ||
      to.path.indexOf('/subscribe') !== -1 ||
      to.path.indexOf('/entryform') !== -1 ||
      to.path.indexOf('/user/home') !== -1 ||
      to.path.indexOf('/live/watch/') !== -1
    ) {
        next()
    } else {
      // 跳转之前，清空所有内容
      console.log('33333333333', to.path, '当前页面');
      sessionOrLocal.clear('localStorage');
      sessionOrLocal.clear();
      if (getQueryString('user_auth_key')) {
        let params = {
          key: getQueryString('user_auth_key'),
          scene_id: 1
        };
        fetch('callbackUserInfo', params).then(res => {
          sessionOrLocal.set('token', res.data.token, 'localStorage');
          next({path: '/'})
        });
      } else {
        next({path: '/login'});
      }
    }
    NProgress.done();
  }
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
