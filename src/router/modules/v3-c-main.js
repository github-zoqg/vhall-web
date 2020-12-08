import Layout from "@/layout/index";

const router = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/FirstPage/index.vue'),
        meta: { title: '首页', icon: 'saasel-icon-v3-home', level: 1 }
      }
    ]
  }
];
export default router;
