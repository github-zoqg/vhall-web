import Layout from "@/layout/index";

const router = [
  {
    path: '/special',
    component: Layout,
    redirect: '/special/list',
    name: 'Special',
    meta: { title: '专题管理', icon: 'saasel-icon-v3-projects', level: 1 },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/SpecialModule/list'),
        meta: { title: '专题列表', level: 2, activeMenu: '/special/list' }
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/SpecialModule/edit'),
        meta: { title: '创建专题', level: 2, activeMenu: '/special/list' }
      }
    ]
  }
];
export default router;
