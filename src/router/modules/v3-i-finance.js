import Layout from "@/layout/index";

const router = [
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/info',
    meta: { auth: true, title: '财务中心', name: 'Finance', icon: 'saasel-icon-v3-financial' },
    children: [
      {
        path: 'info',
        component: () => import('@/views/FinanceModule/info'),
        meta: { auth: true, title: '财务总览', name: 'financeInfo'}
      },
      {
        path: 'income',
        component: () => import('@/views/FinanceModule/income'),
        meta: { auth: true, title: '账户收益', name: 'financeIncome'}
      },
      {
        path: '/incomeDetail/:str(\\d+)',
        component: () => import('@/views/FinanceModule/incomeDetail'),
        meta:{ auth: true,  title: '收益详情', name: 'incomeDetail', activeMenu: '/finance/info'},
        hidden: true
      },
      {
        path: '/payOrder',
        component: () => import('@/views/FinanceModule/payList'),
        meta:{ auth: true,  title: '购买列表', name: 'payOrder', activeMenu: '/finance/info'},
        hidden: true
      },
      {
        path: '/infoDetail',
        component: () => import('@/views/FinanceModule/infoDetail'),
        meta:{ auth: true,  title: '账单明细', name: 'infoDetail', activeMenu: '/finance/info'},
        hidden: true
      },
      {
        path: '/accountDetail',
        component: () => import('@/views/FinanceModule/accountDetail'),
        meta:{ auth: true,  title: '提现明细', name: 'accountDetail', activeMenu: '/finance/income'},
        hidden: true
      },
      {
        path: '/orderDetail',
        component: () => import('@/views/FinanceModule/orderDetail'),
        meta:{ auth: true,  title: '订单支付', name: 'orderDetail', activeMenu: '/finance/income'},
        hidden: true
      }
    ]
  }
];
export default router;
