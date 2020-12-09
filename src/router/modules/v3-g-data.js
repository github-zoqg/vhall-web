import Layout from "@/layout/index";

const router = [
  {
    path: '/data',
    component: Layout,
    redirect: '/data/info',
    meta: { auth: true,  title: '数据中心', name: 'dataMgr', icon: 'saasel-icon-v3-charts' },
    children: [
      {
        path: 'info',
        component: () => import('@/views/StatisticsModule/dataInfo'),
        meta: { auth: true, title: '数据总览', name: 'dataInfo'}
      },
      {
        path: 'live',
        component: () => import('@/views/StatisticsModule/dataLive'),
        meta: { auth: true, title: '活动数据', name: 'dataLive'}
      }
    ]
  }
];
export default router;
