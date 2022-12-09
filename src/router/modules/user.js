import Layout from '@/layout/index';
import { sessionOrLocal } from '@/utils/utils';
import emptyLayout from '@/layout/emptyLayout';

const router = [
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/info',
    meta: { auth: true, title: '财务中心', name: 'Finance', icon: 'saasicon_financial_img' },
    children: [
      {
        path: 'info',
        component: () => import('@/views/FinanceModule/info'),
        meta: { auth: true, title: '财务总览', name: 'financeInfo' }
      },
      {
        path: 'income',
        component: () => import('@/views/FinanceModule/income'),
        meta: { auth: true, title: '账户收益', name: 'financeIncome' }
      },
      {
        path: 'incomeDetail/:str(\\d+)',
        component: () => import('@/views/FinanceModule/incomeDetail'),
        meta: {
          auth: true,
          title: '收益详情',
          name: 'incomeDetail',
          activeMenu: '/finance/income'
        },
        hidden: true
      },
      {
        path: 'payOrder',
        component: () => import('@/views/FinanceModule/payList'),
        meta: { auth: true, title: '订单支付', name: 'payOrder', activeMenu: '/finance/info' },
        hidden: true
      },
      {
        path: 'infoDetail',
        component: () => import('@/views/FinanceModule/infoDetail'),
        meta: { auth: true, title: '账单明细', name: 'infoDetail', activeMenu: '/finance/info' },
        hidden: true
      },
      {
        path: 'accountDetail',
        component: () => import('@/views/FinanceModule/accountDetail'),
        meta: {
          auth: true,
          title: '提现明细',
          name: 'accountDetail',
          activeMenu: '/finance/income'
        },
        hidden: true
      },
      {
        path: 'orderDetail',
        component: () => import('@/views/FinanceModule/orderDetail'),
        meta: { auth: true, title: '升级版本', name: 'orderDetail', activeMenu: '/finance/income' },
        hidden: true
      }
    ]
  },
  {
    path: '/weixin',
    component: () => import('@/views/FinanceModule/components/weixin'),
    meta: { auth: true, name: 'wx' },
    hidden: true
  },
  {
    path: '/acc',
    component: Layout,
    redirect: '/acc/info',
    meta: { auth: true, title: '账户管理', name: 'accountMgr', icon: 'saasicon_account_img' },
    children: [
      {
        path: 'info',
        component: () => import('@/views/AccountModule/info'),
        meta: { auth: true, title: '账户信息', name: 'accountInfo', activeMenu: '/acc/info' }
      },
      {
        path: 'son',
        component: () => import('@/views/AccountModule/son'),
        meta: { auth: true, title: '子账号管理', name: 'sonMgr', activeMenu: '/acc/son' }
      },
      /*{
        path: `userHome`,
        component: emptyLayout,
        redirect: `/user/home/${sessionOrLocal.get('userId')}`,
        meta: { auth: true, title: '个人主页', name: 'homeMain' , activeMenu: '/acc/son'}
      },*/
      {
        path: 'myHome',
        component: () => import('@/views/UserHome/home'),
        meta: {
          auth: true,
          title: '个人主页',
          name: 'myHome',
          activeMenu: '/acc/myHome',
          type: 'owner'
        }
      },
      {
        path: '/homeSet/:str(\\d+)',
        component: () => import('@/views/UserHome/homeSet'),
        meta: { auth: true, title: '设置', name: 'homeSet', activeMenu: '/acc/myHome' },
        hidden: true
      },
      {
        path: '/allocation',
        component: () => import('@/views/AccountModule/allocation'),
        meta: { auth: true, title: '用量分配', name: 'allocation', activeMenu: '/acc/son' },
        hidden: true
      },
      {
        path: '/sonDetail/:str(\\d+)',
        component: () => import('@/views/AccountModule/sonDetail'),
        meta: { auth: true, title: '子账号信息', name: 'sonDetail', activeMenu: '/acc/son' },
        hidden: true
      }
    ]
  },
  {
    path: '/user/home/:str(\\d+)',
    component: () => import('@/views/UserHome/home'),
    meta: { auth: false, title: '个人主页', name: 'userHome', type: 'new' },
    hidden: true
  }
];
export default router;
