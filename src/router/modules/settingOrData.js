import Layout from '@/layout/index';

const router = [
  {
    path: '/data',
    component: Layout,
    redirect: '/data/info',
    meta: { auth: true, title: '数据中心', name: 'dataMgr', icon: 'saasicon_charts_img' },
    children: [
      {
        path: 'info',
        component: () => import('@/views/StatisticsModule/dataInfo'),
        meta: { auth: true, title: '数据总览', name: 'dataInfo' }
      },
      {
        path: 'live',
        component: () => import('@/views/StatisticsModule/dataLive'),
        meta: { auth: true, title: '活动数据', name: 'dataLive' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/chat',
    meta: { auth: true, title: '设置中心', name: 'settingMgr', icon: 'saasicon_Settings_img' },
    children: [
      // {
      //   path: 'info',
      //   component: () => import('@/views/SettingModule/setting.vue'),
      //   meta: { auth: true, title: '开发设置', name: 'settingInfo', activeMenu: '/setting/info' }
      // }, // 开发设置 - 总览页隐藏
      {
        path: 'chat',
        component: () => import('@/views/SettingModule/chat'),
        name: 'chat',
        meta: { auth: true, title: '聊天严禁词', name: 'chatMgr', activeMenu: '/setting/chat' }
      },
      {
        path: 'safeScreen',
        component: () => import('@/views/SettingModule/safeScreen'),
        name: 'safeScreen',
        meta: {
          auth: true,
          title: '防录屏设置',
          name: 'safeScreen',
          activeMenu: '/setting/safeScreen',
          auth_key: 'player_config'
        }
      },
      {
        path: '/setting/dev',
        component: () => import('@/views/SettingModule/setting'),
        name: 'dev',
        meta: { title: '开发设置', icon: '', name: 'devMgr', activeMenu: '/setting/dev' }
      },
      {
        path: 'logo',
        component: () => import('@/views/SettingModule/logo'),
        name: 'logo',
        meta: { auth: true, title: '控制台标识', name: 'logoMgr', activeMenu: '/setting/logo' }
      },
      {
        path: 'function',
        component: () => import('@/views/SettingModule/setFunction'),
        name: 'function',
        meta: {
          auth: true,
          title: '功能配置',
          name: 'functionMgr',
          activeMenu: '/setting/function'
        }
      },
      {
        path: 'brand',
        component: () => import('@/views/SettingModule/setLiving'),
        name: 'brand',
        meta: { auth: true, title: '直播间设计器', name: 'livingMgr', activeMenu: '/setting/brand' }
      },
      {
        path: 'protocol',
        component: () => import('@/views/SettingModule/protocol'),
        name: 'protocol',
        meta: {
          auth: true,
          title: '观看协议',
          name: 'protocolMgr',
          activeMenu: '/setting/protocol',
          auth_key: 'watch.viewing_protocol'
        }
      },
      {
        path: 'player',
        component: () => import('@/views/SettingModule/setPlayer'),
        name: 'player',
        meta: {
          auth: true,
          title: '播放器设置',
          name: 'playerMgr',
          activeMenu: '/setting/player',
          auth_key: 'player_config'
        }
      },
      {
        path: 'tagset',
        component: () => import('@/views/SettingModule/tagSet/index.vue'),
        name: 'tagset',
        meta: { auth: true, title: '标签设置', name: 'tagset', activeMenu: '/setting/tagset' }
      },
      {
        path: '/dev/add',
        component: () => import('@/views/SettingModule/Development/appInfo'),
        meta: {
          auth: true,
          title: '新增应用',
          name: 'devAdd',
          activeMenu: '/setting/dev',
          action: 'add'
        },
        hidden: true
      },
      {
        path: '/dev/:appId(\\d+)',
        component: () => import('@/views/SettingModule/Development/appInfo'),
        meta: {
          auth: true,
          title: '应用详情',
          name: 'devModify',
          activeMenu: '/setting/dev',
          action: 'detail'
        },
        hidden: true
      },
      {
        path: '/dev/callback',
        component: () => import('@/views/SettingModule/Development/callback'),
        meta: { auth: true, title: '回调设置', name: 'devCallback', activeMenu: '/setting/dev' },
        hidden: true
      },
      {
        path: 'logo/:str(\\d+)',
        component: () => import('@/views/SettingModule/logo'),
        meta: { auth: true, title: '控制台标识', name: 'logoSetting', activeMenu: '/setting/logo' },
        hidden: true
      }
    ]
  }
];
export default router;
