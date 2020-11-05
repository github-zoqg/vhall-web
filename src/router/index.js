import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/videoManage',
    name: 'videoManage',
    component: () => import('@/views/StatisticsModule/video.vue')
  },
  {
    path: '/VideoPreview',
    name: 'VideoPreview',
    component: () => import('@/views/StatisticsModule/VideoPreview/index.vue')
  },
  {
    path: '/docManage',
    name: 'docManage',
    component: () => import('@/views/StatisticsModule/doc.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/videoManage',
    name: 'videoManage',
    component: () => import('../views/StatisticsModule/video.vue')
  },
  {
    path: '/live-list',
    name: 'liveList',
    component: () => import('@/views/LiveModule/list.vue')
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
    name: '财务总览',
    component: () => import('@/views/FinanceModule/info.vue')
  },
  {
    path: '/finance-income',
    title: '账户收益',
    name: '账户收益',
    component: () => import('@/views/FinanceModule/income.vue')
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

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
