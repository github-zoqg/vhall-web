import Layout from "@/layout/index";
import {sessionOrLocal} from "@/utils/utils";

const router = [
  {
    path: '/bangWeixin',
    component: () => import('@/views/FinanceModule/components/weixin'),
    hidden: true
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/info',
    name: 'Account',
    meta: { title: '账户管理', icon: 'saasel-icon-v3-account' },
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/AccountModule/info'),
        meta: { title: '账户信息'}
      },
      {
        path: 'son',
        name: 'son',
        component: () => import('@/views/AccountModule/son'),
        meta: { title: '子账号管理'}
      },
      {
        path: `http://localhost:8080/#/user/home/${sessionOrLocal.get('userId')}`,
        meta: { title: '个人主页' }
      },
      {
        path: '/allocation/:str(\\d+)',
        component: () => import('@/views/AccountModule/allocation'),
        name: 'allocation',
        meta:{ title: '用量分配', activeMenu: '/account/son'},
        hidden: true
      },
      {
        path: '/sonDetail/:str(\\d+)',
        component: () => import('@/views/AccountModule/sonDetail'),
        name: 'sonDetail',
        meta:{ title: '子账号详情', activeMenu: '/account/son'},
        hidden: true
      }
    ]
  }
];
export default router;
