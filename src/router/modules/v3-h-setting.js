import Layout from "@/layout/index";

const router = [
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/info',
    name: 'Setting',
    meta: { title: '设置中心'},
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/SettingModule/setting.vue'),
        meta: { title: '设置中心', icon: 'saasel-icon-v3-settings' }
      },
      {
        path: 'chat/:str(\\d+)',
        component: () => import('@/views/SettingModule/chat'),
        name: 'chat',
        meta:{ title: '聊天严禁词', activeMenu: '/setting/info'},
        hidden: true
      },
      // {
      //   path: '/dev/:str(\\d+)',
      //   component: () => import('@/views/SettingModule/dev'),
      //   name: 'dev',
      //   meta:{ title: '开发设置', icon: '' , activeMenu: '/setting/info'},
      //   hidden: true
      // },
      {
        path: '/dev/add',
        component: () => import('@/views/SettingModule/Development/appInfo'),
        name: 'devAdd',
        meta:{ title: '新增应用', activeMenu: '/setting/info', action: 'add'},
        hidden: true
      },
      {
        path: '/dev/:appId(\\d+)',
        component: () => import('@/views/SettingModule/Development/appInfo'),
        name: 'devModify',
        meta:{ title: '应用详情', activeMenu: '/setting/info', action: 'detail'},
        hidden: true
      },
      {
        path: '/dev/list',
        component: () => import('@/views/SettingModule/Development/list'),
        name: 'devlIST',
        meta:{ title: '开发设置', activeMenu: '/setting/info'},
        hidden: true
      },
      {
        path: 'logo/:str(\\d+)',
        component: () => import('@/views/SettingModule/logo'),
        name: 'logo',
        meta:{ title: '控制台标志', activeMenu: '/setting/info'},
        hidden: true
      }
    ]
  }
];
export default router;
