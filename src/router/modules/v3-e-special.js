import Layout from "@/layout/index";

const router = [
  {
    path: '/special',
    component: Layout,
    redirect: '/special/list',
    meta: { auth: true, title: '专题管理', name: 'Special', icon: 'saasel-icon-v3-projects', level: 1 },
    children: [
      {
        path: 'list',
        component: () => import('@/views/SpecialModule/list'),
        meta: { auth: true, title: '专题列表', name: 'specialList', level: 2, activeMenu: '/special/list' }
      },
      {
        path: 'edit',
        component: () => import('@/views/SpecialModule/edit'),
        meta: { auth: true, title: '创建专题', name: 'specialEdit', level: 2, activeMenu: '/special/list' }
      }
    ]
  }
];
export default router;
