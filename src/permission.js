import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import fetchData from './api/fetch';
import { sessionOrLocal } from './utils/utils';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/register'];
router.beforeEach((to, from, next) => {
    NProgress.start();
    let token = window.sessionStorage.getItem('token');
    if (token) {
      // 已登录不准跳转登录页
      console.log('11111111', to.path, '当前页面');
      if (to.path === '/login') {
          next({ path: '/' });
          NProgress.done();
          return;
      }
      // 登录状态跳转非登录页面
      //存在token
      // 获取用户信息
     fetchData('getInfo', {scene_id: 2}).then(res => {
        // debugger;
        if(res.code === 200) {
          console.log('222222', to.path, '当前页面');
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
      whiteList.includes(to.path) ? next() : next({path: '/login'});
      NProgress.done();
    }
});
router.afterEach(() => {
    NProgress.done();
});
