import Layout from "@/layout/index";

const router = [
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/info',
    name: 'Finance',
    meta: { title: '财务中心', icon: 'saasel-icon-v3-financial' },
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/FinanceModule/info'),
        meta: { title: '财务总览'}
      },
      {
        path: 'income',
        name: 'income',
        component: () => import('@/views/FinanceModule/income'),
        meta: { title: '账户收益'}
      },
      {
        path: '/incomeDetail/:str(\\d+)',
        component: () => import('@/views/FinanceModule/incomeDetail'),
        name: 'incomeDetail',
        meta:{ title: '收益详情', activeMenu: '/finance/info'},
        hidden: true
      },
      {
        path: '/payOrder',
        component: () => import('@/views/FinanceModule/payList'),
        name: 'payOrder',
        meta:{ title: '购买列表', activeMenu: '/finance/info'},
        hidden: true
      },
      {
        path: '/infoDetail',
        component: () => import('@/views/FinanceModule/infoDetail'),
        name: 'infoDetail',
        meta:{ title: '账单明细', activeMenu: '/finance/info'},
        hidden: true
      },
      {
        path: '/accountDetail',
        component: () => import('@/views/FinanceModule/accountDetail'),
        name: 'accountDetail',
        meta:{ title: '提现明细', activeMenu: '/finance/income'},
        hidden: true
      },
      {
        path: '/orderDetail',
        component: () => import('@/views/FinanceModule/orderDetail'),
        name: 'orderDetail',
        meta:{ title: '订单支付', activeMenu: '/finance/income'},
        hidden: true
      }
    ]
  }
];
export default router;
