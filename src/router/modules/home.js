import Layout from "@/layout/index";

const router = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        component: () => import('@/views/FirstPage/index.vue'),
        meta: { auth: true, title: '首页', icon: 'saasicon_home_img', level: 1 , name: 'sysHome'}
      }
    ]
  }
];
export default router;
