import emptyLayout from "@/layout/emptyLayout";

const router = [
  {
    path: '/special/detail',
    name: 'detail',
    component: () => import('@/views/SpecialModule/components/preShow'),
    hidden: true
  },
  {
    path: '/emptyLayout',
    component: emptyLayout,
    name: 'emptyLayout',
    redirect: '/',
    hidden: true,
    children: [
      {
        path: '/live/room/:il_id',
        component: () => import('@/views/LiveModule/Room'),
        name: 'LiveRoom',
        meta: { title: '直播间' },
      },
      {
        path: '/live/watch/:il_id',
        component: () => import('@/views/LiveModule/Room/watchWrap'),
        name: 'LiveRoom',
        meta: { title: '观看直播' },
      },
      {
        path: '/subscribe/:id',
        name: 'list',
        component: () => import('@/views/LiveModule/Subscribe/index'),
        meta: { title: '预约' }
      },
      {
        path: '/keylogin/:id',
        name: 'list',
        component: () => import('@/views/LiveModule/Subscribe/index'),
        meta: { title: '口令登录' }
      },
      {
        path: '/keylogin-host/:id',
        name: 'list',
        component: () => import('@/views/LiveModule/Subscribe/index'),
        meta: { title: '口令登录' }
      }
    ]
  }
];
export default router;
