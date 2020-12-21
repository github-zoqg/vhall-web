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
        name: 'LiveWatch',
        meta: { title: '观看直播' },
      },
      {
        path: '/subscribe/:id',
        name: 'Subscribe',
        component: () => import('@/views/LiveModule/Subscribe/index'),
        meta: { title: '预约' }
      },
      {
        path: '/entryform/:id',
        name: 'Entryform',
        component: () => import('@/views/LiveModule/Subscribe/entryForm'),
        meta: { title: '报名表单' }
      },
      {
        path: '/keylogin/:id/:role_name',
        name: 'KeyLogin',
        component: () => import('@/views/LiveModule/CodeLogin/index'),
        meta: { title: '口令登录' }
      },
      {
        path: '/keylogin-host/:id/:role_name',
        name: 'KeyLoginHost',
        component: () => import('@/views/LiveModule/Subscribe/index'),
        meta: { title: '口令登录' }
      },
      {
        path: '/live/qa/:id',
        name: 'qa',
        component: () => import('@/views/LiveModule/Qa/index'),
        meta: { title: '问答' }
      },
      {
        path: '/live/authchat/:id',
        name: 'authchat',
        component: () => import('@/views/LiveModule/AuthChat/index'),
        meta: { title: '聊天过滤' }
      }
    ]
  }
];
export default router;
