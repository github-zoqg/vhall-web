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
    if (JSON.parse(token)) {
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
          sessionOrLocal.set('userInfo', JSON.stringify(res.data));
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
router.afterEach(() => {
    NProgress.done();
});
