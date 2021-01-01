import Layout from "@/layout/index";

const router = [
  {
    path: '/data',
    component: Layout,
    redirect: '/data/info',
    meta: { auth: true,  title: '数据中心', name: 'dataMgr', icon: 'saasicon_charts' },
    children: [
      {
        path: 'info',
        component: () => import('@/views/StatisticsModule/dataInfo'),
        meta: { auth: true, title: '数据总览', name: 'dataInfo'}
      },
      {
        path: 'live',
        component: () => import('@/views/StatisticsModule/dataLive'),
        meta: { auth: true, title: '活动数据', name: 'dataLive'}
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/info',
    meta: { auth: true, title: '设置中心', name: 'settingMgr'},
    children: [
      {
        path: 'info',
        component: () => import('@/views/SettingModule/setting.vue'),
        meta: { auth: true, title: '设置中心', name: 'settingInfo' ,icon: 'saasicon_Settings' }
      },
      {
        path: 'chat/:str(\\d+)',
        component: () => import('@/views/SettingModule/chat'),
        name: 'chat',
        meta:{ auth: true, title: '聊天严禁词', name: 'chatMgr', activeMenu: '/setting/info'},
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
        meta:{ auth: true, title: '新增应用', name: 'devAdd', activeMenu: '/setting/info', action: 'add'},
        hidden: true
      },
      {
        path: '/dev/:appId(\\d+)',
        component: () => import('@/views/SettingModule/Development/appInfo'),
        meta:{ auth: true, title: '应用详情', name: 'devModify', activeMenu: '/setting/info', action: 'detail'},
        hidden: true
      },
      {
        path: '/dev/list',
        component: () => import('@/views/SettingModule/Development/list'),
        meta:{ auth: true, title: '开发设置', name: 'devList', activeMenu: '/setting/info'},
        hidden: true
      },
      {
        path: '/dev/callback',
        component: () => import('@/views/SettingModule/Development/callback'),
        meta:{ auth: true, title: '开发设置', name: 'devCallback', activeMenu: '/setting/info'},
        hidden: true
      },
      {
        path: 'logo/:str(\\d+)',
        component: () => import('@/views/SettingModule/logo'),
        meta:{ auth: true, title: '控制台标志', name: 'logoSetting',activeMenu: '/setting/info'},
        hidden: true
      }
    ]
  }
];
export default router;
