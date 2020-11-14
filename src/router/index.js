import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
Vue.use(VueRouter);

// 引入布局层
import Layout from '@/layout';

// 全局路由(无需嵌套上左右整体布局)
const v3GlobalRoutes = [
  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/login',
    component: () => import('@/views/PlatformModule/Login/index'),
    hidden: true // 是否需要整体面板
  },
  {
    path: '/404',
    component: () => import('@/views/PlatformModule/Error/index'),
    hidden: true
  }
];

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/FirstPage/index.vue')
  },
  {
    path: '/default',
    name: 'home',
    component: () => import('../views/FirstPage/index.vue')
  },
  /*********************************直播管理 ********************************************/
  {
    path: '/live-list',
    name: 'liveList',
    component: () => import('@/views/LiveModule/list.vue')
  },
  {
    path: '/live-warm',
    name: 'liveWarm',
    component: () => import('@/views/LiveModule/warm.vue')
  },
  {
    path: '/live/edit',
    name: 'liveEdit',
    meta:{webniarType: "live"},
    component: () => import('@/views/LiveModule/edit.vue')
  },
  {
    path: '/vod/edit',
    name: 'vodEdit',
    meta:{webniarType: "vod"},
    component: () => import('@/views/LiveModule/edit.vue')
  },
  {
    path: '/live-detail/:str',
    title: '直播-详情',
    name: 'liveDetail',
    component: () => import('@/views/LiveModule/detail.vue')
  },
  {
    path: '/plan-function/:str',
    title: '准备——功能配置',
    name: 'planFunction',
    component: () => import('@/views/LiveModule/planFunction.vue')
  },
  {
    path: '/signup',
    title: '报名表单',
    name: 'signUp',
    component: () => import('@/views/LiveModule/signUp/main.vue')
  },
  {
    path: '/virtual/:str',
    title: '准备——虚拟人数',
    name: 'virtual',
    component: () => import('@/views/LiveModule/virtual.vue')
  },
  {
    path: '/custom-tab/:str',
    title: '品牌——自定义菜单',
    name: 'planFunction',
    component: () => import('@/views/LiveModule/customTab.vue')
  },
  {
    path: '/playback/list/:str',
    title: '回放-列表',
    name: 'playBackList',
    component: () => import('@/views/LiveModule/PlayBack/list.vue')
  },
  {
    path: '/playback/chapter',
    title: '回放-章节打点',
    name: 'playBackChapter',
    component: () => import('@/views/LiveModule/PlayBack/chapter.vue')
  },
  /*-----------------------------------品牌设置------------------------*/
  {
    path: '/brand-set/:str',
    title: '品牌——品牌设置',
    name: 'brandSet',
    component: () => import('@/views/LiveModule/brandSet.vue')
  },
  {
    path: '/invitation-card',
    title: '品牌——邀请卡',
    name: 'invitation',
    component: () => import('@/views/LiveModule/Brands/invitationCard.vue')
  },
  {
    path: '/advertisement-card',
    title: '广告推荐',
    name: 'advertisement',
    component: () => import('@/views/LiveModule/Brands/advertisementCard.vue')
  },
  {
    path: '/official-card',
    title: '公众号展示',
    name: 'official',
    component: () => import('@/views/LiveModule/Brands/officialCard.vue')
  },
  {
    path: '/poster-card',
    title: '品牌——开屏海报',
    name: 'poster',
    component: () => import('@/views/LiveModule/Brands/posterCard.vue')
  },
  /*-----------------------------------直播详情中数据------------------------*/
  {
    path: '/reports-data',
    title: '数据报告',
    name: 'reportsData',
    component: () => import('@/views/LiveModule/Data/reportsData.vue')
  },
  {
    path: '/interaction-data',
    title: '互动统计',
    name: 'interaction',
    component: () => import('@/views/LiveModule/Data/interactData.vue')
  },
  {
    path: '/user-data',
    title: '用户统计',
    name: 'user',
    component: () => import('@/views/LiveModule/Data/userData.vue')
  },
  {
    path: '/interaction-detail',
    title: '查看数据',
    name: 'interactionDetail',
    component: () => import('@/views/LiveModule/Data/interactDetail.vue')
  },

  /*********************************直播管理 ********************************************/
  {
    path: '/viewer-rules/:str',
    title: '准备——观看限制',
    name: 'viewerRules',
    component: () => import('@/views/LiveModule/viewerRules.vue')
  },
  {
    path: '/css-demo',
    title: '样式Demo',
    name: '样式Demo',
    component: () => import('@/views/PlatformModule/cssDemo.vue')
  },
  {
    path: '/error',
    title: '错误提示',
    name: '错误提示',
    component: () => import('@/views/PlatformModule/Error/index.vue')
  },
  {
    path: '/msg-list',
    title: '消息中心',
    name: '消息中心',
    component: () => import('@/views/PlatformModule/Message/list.vue')
  },
  {
    path: '/msg-detail/:str',
    title: '消息中心-详情',
    name: '消息中心-详情',
    component: () => import('@/views/PlatformModule/Message/detail.vue')
  },
  {
    path: '/download-list',
    title: '下载中心',
    name: '下载中心',
    component: () => import('@/views/PlatformModule/download.vue')
  },
  /*-----------------------------------专题管理------------------------*/
  {
    path: '/specials-list',
    title: '专题列表',
    name: '专题列表',
    component: () => import('@/views/SpecialModule/list.vue')
  },
  {
    path: '/special-detail/:str',
    title: '创建专题',
    name: '创建专题',
    component: () => import('@/views/SpecialModule/detail.vue')
  },
  /*-----------------------------------资料管理------------------------*/
  {
    path: '/material-word',
    title: '文档',
    name: '文档',
    component: () => import('@/views/MaterialModule/word.vue')
  },
  {
    path: '/material-video',
    title: '音视频',
    name: '音视频',
    component: () => import('@/views/MaterialModule/video.vue')
  },
  {
    path: '/material-question',
    title: '问卷',
    name: '问卷',
    component: () => import('@/views/MaterialModule/question.vue')
  },
  {
    path: '/material-prize',
    title: '奖品',
    name: '奖品',
    component: () => import('@/views/MaterialModule/prize.vue')
  },
  {
    path: '/material-viewer',
    title: '观众',
    name: '观众',
    component: () => import('@/views/MaterialModule/viewer.vue')
  },
  {
    path: '/material-advert',
    title: '广告推荐',
    name: '广告推荐',
    component: () => import('@/views/MaterialModule/advert.vue')
  },
  {
    path: '/material-gift',
    title: '礼物',
    name: '礼物',
    component: () => import('@/views/MaterialModule/gift.vue')
  },
  /*-----------------------------------数据中心------------------------*/
  {
    path: '/data-info',
    title: '数据总览',
    name: '数据总览',
    component: () => import('@/views/StatisticsModule/dataInfo.vue')
  },
  {
    path: '/data-live',
    title: '活动数据',
    name: '活动数据',
    component: () => import('@/views/StatisticsModule/dataLive.vue')
  },
  /*-----------------------------------设置中心------------------------*/
  {
    path: '/setting',
    title: '设置中心',
    name: '设置中心',
    component: () => import('@/views/SettingModule/setting.vue')
  },
  {
    path: '/setting-chat',
    title: '聊天严禁词',
    name: '聊天严禁词',
    component: () => import('@/views/SettingModule/chat.vue')
  },
  {
    path: '/setting-dev',
    title: '开发设置',
    name: '开发设置',
    component: () => import('@/views/SettingModule/dev.vue')
  },
  {
    path: '/setting-logo',
    title: '控制台标志',
    name: '控制台标志',
    component: () => import('@/views/SettingModule/logo.vue')
  },
  /*-----------------------------------财务中心------------------------*/
  {
    path: '/finance-info',
    title: '财务总览',
    name: 'info',
    component: () => import('@/views/FinanceModule/info.vue')
  },
  {
    path: '/finance-infoDetail',
    title: '账单明细',
    name: 'infoDetail',
    component: () => import('@/views/FinanceModule/infoDetail.vue')
  },
  {
    path: '/finance-income',
    title: '账户收益',
    name: 'income',
    component: () => import('@/views/FinanceModule/income.vue')
  },
  {
    path: '/finance-incomeDetail',
    title: '收益详情',
    name: 'incomeDetail',
    component: () => import('@/views/FinanceModule/incomeDetail.vue')
  },
  {
    path: '/pay-order',
    title: '购买列表',
    name: 'payOrder',
    component: () => import('@/views/FinanceModule/payList.vue')
  },
  /*-----------------------------------账户管理------------------------*/
  {
    path: '/account-info',
    title: '账户信息',
    name: '账户信息',
    component: () => import('@/views/AccountModule/info.vue')
  },
  {
    path: '/account-son',
    title: '子账号管理',
    name: '子账号管理',
    component: () => import('@/views/AccountModule/son.vue')
  },
  {
    path: '/son-detail/:str',
    title: '子账号管理-详情',
    name: '子账号管理-详情',
    component: () => import('@/views/AccountModule/sonDetail.vue')
  },
  {
    path: '/allocation/:str',
    title: '用量分配',
    name: '子账号管理-详情',
    component: () => import('@/views/AccountModule/allocation.vue')
  },
  {
    path: '/account-home',
    title: '个人主页',
    name: '个人主页',
    component: () => import('@/views/AccountModule/home.vue')
  },

];

const emptyLayoutRoutes= [
  {
    path: '/playback/video-tailoring',
    title: '剪辑台',
    name: 'videoTailoring',
    component: () => import('@/views/LiveModule/PlayBack/videoTailoring.vue')
  },
];

// 主入口路由(需嵌套上左右整体布局)
export const v3MainRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/FirstPage/index.vue'),
        meta: { title: '首页', icon: 'el-icon-s-home' }
      }
    ]
  },
  {
    path: '/live',
    component: Layout,
    redirect: '/live/list',
    name: 'Live',
    meta: { title: '直播管理', icon: 'el-icon-video-camera' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/LiveModule/list'),
        meta: { title: '直播列表', icon: 'table' }
      },
      {
        path: 'edit/0',
        name: 'edit',
        component: () => import('@/views/LiveModule/edit'),
        meta: { title: '创建直播', icon: 'edit' }
      },
      {
        path: '/vodEdit/:str(\\d+)',
        component: () => import('@/views/LiveModule/edit'),
        name: 'vodEdit',
        meta:{ webniarType: 'vod', title: '准备-基本信息', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/detail/:str(\\d+)',
        component: () => import('@/views/LiveModule/detail'),
        name: 'detail',
        meta:{ title: '直播-详情', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/signup/:str(\\d+)',
        component: () => import('@/views/LiveModule/signUp/main'),
        name: 'signup',
        meta:{ title: '准备—报名表单', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/viewerRules/:str(\\d+)',
        component: () => import('@/views/LiveModule/viewerRules'),
        name: 'viewerRules',
        meta:{ title: '准备—观看限制', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/live/planFunction/:str(\\d+)',
        component: () => import('@/views/LiveModule/planFunction'),
        name: 'planFunction',
        meta:{ title: '准备—功能配置', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/virtual/:str(\\d+)',
        component: () => import('@/views/LiveModule/viewerRules'),
        name: 'virtual',
        meta:{ title: '准备—虚拟人数', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/warm/:str(\\d+)',
        component: () => import('@/views/LiveModule/warm'),
        name: 'warm',
        meta:{ title: '准备—暖场视频', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/brandSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/brandSet'),
        name: 'brandSet',
        meta:{ title: '品牌—品牌设置', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/invCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/invitationCard'),
        name: 'invCard',
        meta:{ title: '品牌—邀请卡', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/advertCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/advertisementCard'),
        name: 'advertCard',
        meta:{ title: '品牌—广告推荐', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/officialCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/officialCard'),
        name: 'officialCard',
        meta:{ title: '品牌—公众号展示', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/posterCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/posterCard'),
        name: 'posterCard',
        meta:{ title: '品牌—开屏海报', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/customTab/:str(\\d+)',
        component: () => import('@/views/LiveModule/customTab'),
        name: 'customTab',
        meta:{ title: '品牌—自定义菜单', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/playback/:str(\\d+)',
        component: () => import('@/views/LiveModule/PlayBack/list'),
        name: 'playback',
        meta:{ title: '回放-回放管理', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/playbackChapter/:str(\\d+)',
        component: () => import('@/views/LiveModule/PlayBack/chapter'),
        name: 'playbackChapter',
        meta:{ title: '回放-章节打点', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/tailoring',
        component: () => import('@/views/LiveModule/PlayBack/videoTailoring'),
        name: 'tailoring',
        meta:{ title: '回放-剪辑台', icon: '' , activeMenu: '/live/list'},
        hidden: true
      }
    ]
  },
  {
    path: '/special',
    component: Layout,
    redirect: '/special/list',
    name: 'Special',
    meta: { title: '专题管理', icon: 'el-icon-set-up' },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/SpecialModule/list'),
        meta: { title: '专题列表', icon: 'table' }
      },
      {
        path: 'detail/:str(\\d+)',
        name: 'detail',
        component: () => import('@/views/SpecialModule/detail'),
        meta: { title: '创建专题', icon: 'table' }
      },
    ]
  },
  {
    path: '/material',
    component: Layout,
    redirect: '/material/word',
    name: 'Material',
    meta: { title: '资料管理', icon: 'el-icon-menu' },
    children: [
      {
        path: 'word',
        name: 'word',
        component: () => import('@/views/MaterialModule/word'),
        meta: { title: '文档', icon: 'table' }
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/MaterialModule/video'),
        meta: { title: '音视频', icon: 'table' }
      },
      {
        path: 'question',
        name: 'question',
        component: () => import('@/views/MaterialModule/question'),
        meta: { title: '问卷', icon: 'table' }
      },
      {
        path: 'prize',
        name: 'prize',
        component: () => import('@/views/MaterialModule/prize'),
        meta: { title: '奖品', icon: 'table' }
      },
      {
        path: 'viewer',
        name: 'viewer',
        component: () => import('@/views/MaterialModule/viewer'),
        meta: { title: '观众', icon: 'table' }
      },
      {
        path: 'advert',
        name: 'advert',
        component: () => import('@/views/MaterialModule/advert'),
        meta: { title: '广告推荐', icon: 'table' }
      },
      {
        path: 'gift',
        name: 'gift',
        component: () => import('@/views/MaterialModule/gift'),
        meta: { title: '礼物', icon: 'table' }
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    redirect: '/data/info',
    name: 'Data',
    meta: { title: '数据中心', icon: 'el-icon-data-analysis' },
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/StatisticsModule/dataInfo'),
        meta: { title: '数据总览', icon: 'table' }
      },
      {
        path: 'live',
        name: 'live',
        component: () => import('@/views/StatisticsModule/dataLive'),
        meta: { title: '直播数据', icon: 'table' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/info',
    name: 'Setting',
    meta: { title: '设置中心', icon: 'el-icon-setting' },
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/SettingModule/setting.vue'),
        meta: { title: '设置中心', icon: 'el-icon-setting' }
      },
      {
        path: '/chat/:str(\\d+)',
        component: () => import('@/views/SettingModule/chat'),
        name: 'chat',
        meta:{ title: '聊天严禁词', icon: '' , activeMenu: '/setting/info'},
        hidden: true
      },
      {
        path: '/dev/:str(\\d+)',
        component: () => import('@/views/SettingModule/dev'),
        name: 'dev',
        meta:{ title: '开发设置', icon: '' , activeMenu: '/setting/info'},
        hidden: true
      },
      {
        path: '/logo/:str(\\d+)',
        component: () => import('@/views/SettingModule/logo'),
        name: 'logo',
        meta:{ title: '控制台标志', icon: '' , activeMenu: '/setting/info'},
        hidden: true
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/info',
    name: 'Finance',
    meta: { title: '财务中心', icon: 'el-icon-postcard' },
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/FinanceModule/info'),
        meta: { title: '财务总览', icon: 'table' }
      },
      {
        path: 'income',
        name: 'income',
        component: () => import('@/views/FinanceModule/income'),
        meta: { title: '账户收益', icon: 'table' }
      },
      {
        path: '/incomeDetail/:str(\\d+)',
        component: () => import('@/views/FinanceModule/incomeDetail'),
        name: 'incomeDetail',
        meta:{ title: '收益详情', icon: '' , activeMenu: '/finance/info'},
        hidden: true
      },
      {
        path: '/payOrder',
        component: () => import('@/views/FinanceModule/payList'),
        name: 'payOrder',
        meta:{ title: '购买列表', icon: '' , activeMenu: '/finance/info'},
        hidden: true
      },
      {
        path: '/infoDetail/:str(\\d+)',
        component: () => import('@/views/FinanceModule/infoDetail'),
        name: 'infoDetail',
        meta:{ title: '账单明细', icon: '' , activeMenu: '/finance/info'},
        hidden: true
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/info',
    name: 'Account',
    meta: { title: '账户管理', icon: 'el-icon-s-custom' },
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/AccountModule/info'),
        meta: { title: '账户信息', icon: 'table' }
      },
      {
        path: 'son',
        name: 'son',
        component: () => import('@/views/AccountModule/son'),
        meta: { title: '子账号管理', icon: 'table' }
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/AccountModule/home'),
        meta: { title: '个人主页', icon: 'table' }
      },
      {
        path: '/allocation/:str(\\d+)',
        component: () => import('@/views/AccountModule/allocation'),
        name: 'allocation',
        meta:{ title: '用量分配', icon: 'table' , activeMenu: '/finance/son'},
        hidden: true
      },
      {
        path: '/sonDetail/:str(\\d+)',
        component: () => import('@/views/AccountModule/sonDetail'),
        name: 'sonDetail',
        meta:{ title: '子账号详情', icon: 'table' , activeMenu: '/finance/son'},
        hidden: true
      }
    ]
  },
  {
    path: '/other',
    component: Layout,
    redirect: '/other/msgList',
    name: 'Other',
    meta: { title: '辅助业务', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'msgList',
        name: 'msgList',
        component: () => import('@/views/PlatformModule/Message/list'),
        meta: {title: '消息中心', icon: 'table'}
      },
      {
        path: '/msgDetail/:str(\\d+)',
        component: () => import('@/views/PlatformModule/Message/detail'),
        name: 'msgDetail',
        meta: {title: '消息详情', icon: 'table', activeMenu: '/other/msgList'},
        hidden: true
      },
      {
        path: '/downloadList',
        component: () => import('@/views/PlatformModule/download'),
        name: 'downloadList',
        meta: {title: '下载中心', icon: 'table'}
      }
    ]
  },
  {
    path: '/css-demo',
    component: Layout,
    name: 'Css',
    meta: { title: '样式Demo', icon: 'el-icon-s-help' }
  }
];

const router = new VueRouter({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: v3GlobalRoutes.concat(v3MainRoutes)
});
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});
router.afterEach(transition => {
  console.log(transition);
  NProgress.done();
});
export default router;
