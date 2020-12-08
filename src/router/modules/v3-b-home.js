const router = [
  {
    path: '/user/home/:str(\\d+)',
    name: 'userHome',
    component: () => import('@/views/UserHome/home'),
    meta: { title: '个人主页'},
    hidden: true
  },
  {
    path: '/user/home/set/:str(\\d+)',
    component: () => import('@/views/UserHome/homeSetInfo'),
    name: 'homeSet',
    meta:{ title: '设置'},
    hidden: true
  },
];
export default router;
