const router = [
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/register',
    component: () => import('@/views/login')
  },
  {
    path: '/forgetPassword',
    component: () => import('@/views/forgetPassword')
  },
];
export default router;
