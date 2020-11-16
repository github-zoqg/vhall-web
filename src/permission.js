import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// import fetch from './api/fetch';
import { sessionOrLocal } from './utils/utils';

NProgress.configure({ showSpinner: false });


router.beforeEach((to, from, next) => {
    NProgress.start();
    if (sessionOrLocal.get('token')) {
      console.log('1111111111111');
      next();
      //存在token
      // 获取用户信息
      // fetch('getInfo', {}).then(res => {
      //   sessionOrLocal.set('userInfo', res.data);
      //   getVersion(res.data.user_id);
      //   next();
      // }).catch(e=>{
      //   console.log(e);
      // });
    } else {
      // token不存在时跳转
      console.log('222222222', to.name, '当前页面');
      if(to.name != 'login'){
        next({path: '/login'});
      }else{
        next();
      }
      NProgress.done();
    }
});
// function getVersion(userId) {
//   fetch('getVersionInfo', { user_id: userId}).then(res => {
//     sessionOrLocal.set('userInfo', res.data);
//   }).catch(e=>{
//     console.log(e);
//   });
// }
router.afterEach(() => {
    NProgress.done();
});
