const router = [
  {
    path: '/warning/:str(.+)', // 说明包含 404，500，405 ，sysUnder 系统维护中，network 网络异常
    component: () => import('@/views/PlatformModule/Error/index'),
    meta: { auth: false, name: 'common'},
    hidden: true
  },
  { path: '*', redirect: '/warning/404', hidden: true }
];
export default router;
