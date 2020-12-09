const router = [
  {
    path: '/login',
    meta: { auth: false, name: 'login', title: '登录' },
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/register',
    meta: { auth: false, name: 'register', title: '注册' },
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/forgetPassword',
    meta: { auth: false, name: 'forgetPassword', title: '忘记密码' },
    component: () => import('@/views/forgetPassword'),
    hidden: true
  },
];
export default router;
