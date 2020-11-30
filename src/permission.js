import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import fetch from './api/fetch';
import { sessionOrLocal } from './utils/utils';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login', '/register'];
router.beforeEach((to, from, next) => {
    NProgress.start();
    if (JSON.parse(sessionOrLocal.get('token'))) {
      console.log('1111111111111');
      // next();
      //存在token
      // 获取用户信息
      fetch('getInfo', {scene_id: 2}).then(res => {
        sessionOrLocal.set('userInfo', JSON.stringify(res.data));
        sessionOrLocal.set('userId', JSON.stringify(res.data.user_id));
        next();
      }).catch(e=>{
        console.log(e);
      });
    } else {
      // token不存在时跳转
      console.log('222222222', to.path, '当前页面');
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
