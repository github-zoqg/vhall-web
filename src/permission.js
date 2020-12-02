import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import fetch from './api/fetch';
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
      fetch('getInfo', {scene_id: 2}).then(res => {
        if(res.code === 200 && res.data) {
          // getVersion(res.data.user_id);
          sessionOrLocal.set('userInfo', JSON.stringify(res.data));
          sessionOrLocal.set('userId', JSON.stringify(res.data.user_id));
        } else {
          sessionOrLocal.set('userInfo', null);
        }
        next();
      }).catch(e=>{
        console.log(e);
        NProgress.done();
      });
    } else {
      // token不存在时跳转
      console.log('4444444', to.path, '当前页面');
      whiteList.includes(to.path) ? next() : next({path: '/login'});
      // if(to.name != 'login'){
      //   next({path: '/login'});
      // }else{
      //   next();
      // }
      NProgress.done();
    }
});
// 保存版本信息
function getVersion(id) {
  fetch('getVersionInfo', { user_id: id}).then(res => {
    sessionOrLocal.set('versionInfo', JSON.stringify(res.data));
  }).catch(e=>{
    console.log(e);
  });
}
router.afterEach(() => {
    NProgress.done();
});
