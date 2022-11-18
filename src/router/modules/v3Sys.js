import Layout from '@/layout/index';
import EmptyLayout from '@/layout/emptyLayout';

const router = [
  {
    path: '/login',
    meta: { auth: false, name: 'login', title: '登录' },
    component: () => import('@/views/Login/login'),
    hidden: true
  },
  {
    path: '/register',
    meta: { auth: false, name: 'register', title: '注册' },
    component: () => import('@/views/Login/login'),
    hidden: true
  },
  {
    path: '/forgetPassword',
    meta: { auth: false, name: 'forgetPassword', title: '忘记密码' },
    component: () => import('@/views/Login/forgetPassword'),
    hidden: true
  },
  {
    path: '/other',
    component: Layout,
    redirect: '/other/msgList',
    meta: { auth: true, title: '辅助业务', name: 'other', icon: 'el-icon-s-help' },
    hidden: true,
    children: [
      {
        path: 'msgList',
        component: () => import('@/views/PlatformModule/Message/list'),
        meta: { auth: true, title: '消息中心', name: 'msgList', icon: 'table' }
      },
      {
        path: 'msgDetail/:str(\\d+)',
        component: () => import('@/views/PlatformModule/Message/detail'),
        meta: {
          auth: true,
          title: '消息详情',
          name: 'msgDetail',
          icon: 'table',
          activeMenu: '/other/msgList'
        },
        hidden: true
      },
      {
        path: 'downloadList',
        component: () => import('@/views/PlatformModule/download'),
        meta: { auth: true, title: '下载中心', name: 'downloadList', icon: 'table' }
      }
    ]
  },
  /* {
    path: '/css-demo',
    component: Layout,
    meta: { auth: false, title: '样式Demo', name: 'cssDemoAll', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'css-demo',
        name: 'css-demo',
        component: () => import('@/views/PlatformModule/cssDemo'),
        meta: { auth: false, title: 'Tinymce富文本', name: 'cssDemo', icon: 'el-icon-s-home' }
      }
    ]
  },*/
  {
    path: '/warning/:str(.+)', // 说明包含 404，500，405 ，sysUnder 系统维护中，network 网络异常
    component: () => import('@/views/PlatformModule/Error/index'),
    meta: { auth: false, name: 'common' },
    hidden: true
  },
  {
    path: '/upgrading', // 说明包含 404，500，405 ，sysUnder 系统维护中，network 网络异常
    component: () => import('@/views/PlatformModule/Upgrading/index'),
    meta: { auth: false, name: 'upgrading' },
    hidden: true
  },
  {
    path: '/browser', // 浏览器
    component: () => import('@/views/PlatformModule/browser'),
    meta: { auth: false, name: 'common' },
    hidden: true
  },
  {
    path: '/nullPage', // 空白
    component: () => import('@/views/PlatformModule/Error/nullPage'),
    meta: { auth: false, name: 'common' },
    hidden: true
  },
  {
    path: '/cMiddle/:str(\\d+)',
    meta: { auth: false, name: 'cMiddle', title: 'C端第三方登录授权' },
    component: () => import('@/views/Login/thirdLogin'),
    hidden: true
  },
  {
    path: '/privacyPolicy',
    meta: { auth: false, name: 'privacyPolicy', title: '隐私政策' },
    component: () => import('@/views/PrivacyModule/privacyPolicy'),
    hidden: true
  },
  {
    path: '/privacyUPo',
    meta: { auth: false, name: 'userProtection', title: '用户服务协议' },
    component: () => import('@/views/PrivacyModule/userProtection'),
    hidden: true
  },
  { path: '*', redirect: '/warning/404', hidden: true }
];
export default router;
