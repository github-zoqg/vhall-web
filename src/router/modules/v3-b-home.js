const router = [
  {
    path: '/user/home/:str(\\d+)',
    component: () => import('@/views/UserHome/home'),
    meta: { auth: false, title: '个人主页', name: 'userHome' },
    hidden: true
  },
  {
    path: '/user/home/set/:str(\\d+)',
    component: () => import('@/views/UserHome/homeSetInfo'),
    meta: { auth: true, title: '设置', name: 'userHomeSet' },
    hidden: true
  },
];
export default router;
