import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
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

const router = new VueRouter({
  // mode: 'history',
  routes: [
    {
      path: '/',
      name: 'baseLoyout',
      component: () => import('@/layout/baseLayout.vue'),
      children: routes
    },
    {
      path: '/',
      name: 'emptyLoyout',
      component: () => import('@/layout/emptyLayout.vue'),
      children: emptyLayoutRoutes
    },
  ]
});

export default router;
