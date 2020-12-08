import Layout from "@/layout/index";
import {sessionOrLocal} from "@/utils/utils";

const router = [
  {
    path: '/bangWeixin',
    component: () => import('@/views/FinanceModule/components/weixin'),
    meta: { auth: true, name: 'wx'},
    hidden: true
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/info',
    meta: { auth: true, title: '账户管理', name:'accountMgr', icon: 'saasel-icon-v3-account' },
    children: [
      {
        path: 'info',
        component: () => import('@/views/AccountModule/info'),
        meta: { auth: true, title: '账户信息', name: 'accountInfo'}
      },
      {
        path: 'son',
        component: () => import('@/views/AccountModule/son'),
        meta: { auth: true, title: '子账号管理', name: 'sonMgr'}
      },
      {
        path: `http://localhost:8080/#/user/home/${sessionOrLocal.get('userId')}`,
        meta: { auth: true, title: '个人主页', name: 'homeMain' }
      },
      {
        path: '/allocation/:str(\\d+)',
        component: () => import('@/views/AccountModule/allocation'),
        meta:{ auth: true, title: '用量分配', name: 'allocation', activeMenu: '/account/son'},
        hidden: true
      },
      {
        path: '/sonDetail/:str(\\d+)',
        component: () => import('@/views/AccountModule/sonDetail'),
        meta:{ auth: true, title: '子账号详情', name: 'sonDetail', activeMenu: '/account/son'},
        hidden: true
      }
    ]
  }
];
export default router;
