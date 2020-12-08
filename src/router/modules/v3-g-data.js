import Layout from "@/layout/index";

const router = [
  {
    path: '/data',
    component: Layout,
    redirect: '/data/info',
    name: 'Data',
    meta: { title: '数据中心', icon: 'saasel-icon-v3-charts' },
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/StatisticsModule/dataInfo'),
        meta: { title: '数据总览'}
      },
      {
        path: 'live',
        name: 'live',
        component: () => import('@/views/StatisticsModule/dataLive'),
        meta: { title: '活动数据'}
      }
    ]
  }
];
export default router;
