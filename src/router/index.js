import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
Vue.use(VueRouter);

// 引入布局层
import Layout from '@/layout';
import emptyLayout from '@/layout/emptyLayout';

// 主入口路由(需嵌套上左右整体布局)
const v3Routes = [
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/register',
    component: () => import('@/views/register')
  },
  {
    path: '/videoTailoring',
    name: 'videoTailoring',
    component: () => import('@/views/LiveModule/PlayBack/videoTailoring')
  },
  {
    path: '/warning/:str(\.+)', // 说明包含 404，500，405 ，sysUnder 系统维护中，network 网络异常
    component: () => import('@/views/PlatformModule/Error/index'),
    hidden: true
  },
  {
    path: '/code',
    component: () => import('@/views/LiveModule/Brands/components/invitationCode'),
    hidden: true
  },
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
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/LiveModule/edit'),
        meta: {webniarType: 'live', title: '创建直播', icon: 'table' , activeMenu: '/live/list'}
      },
      {
        path: 'vodEdit',
        name: 'vodEdit',
        component: () => import('@/views/LiveModule/edit'),
        meta: {webniarType: 'live', title: '创建点播', icon: 'table' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'detail/:str(\\d+)',
        component: () => import('@/views/LiveModule/detail'),
        name: 'detail',
        meta:{ title: '直播详情', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'chooseWay/:str(\\d+)',
        component: () => import('@/views/LiveModule/chooseWay'),
        name: 'chooseWay',
        meta:{ title: '选择发起方式', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'signup/:str(\\d+)',
        component: () => import('@/views/LiveModule/signUp/main'),
        name: 'signup',
        meta:{ title: '准备—报名表单', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'viewerRules/:str(\\d+)',
        component: () => import('@/views/LiveModule/viewerRules'),
        name: 'viewerRules',
        meta:{ title: '准备—观看限制', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'roleInvitation/:str(\\d+)',
        component: () => import('@/views/LiveModule/roleInvitation'),
        name: 'roleInvitation',
        meta:{ title: '准备—角色邀请', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'planFunction/:str(\\d+)',
        component: () => import('@/views/LiveModule/planFunction'),
        name: 'planFunction',
        meta:{ title: '准备—功能配置', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'virtual/:str(\\d+)',
        component: () => import('@/views/LiveModule/viewerRules'),
        name: 'virtual',
        meta:{ title: '准备—虚拟人数', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'warm/:str(\\d+)',
        component: () => import('@/views/LiveModule/warm'),
        name: 'warm',
        meta:{ title: '准备—暖场视频', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'embedCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/embedCard'),
        name: 'embedCard',
        meta:{ title: '准备—推广嵌入', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'brandSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/brandSet'),
        name: 'brandSet',
        meta:{ title: '品牌—品牌设置', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'playerSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/playerSet'),
        name: 'playerSet',
        meta:{ title: '品牌—播放器设置', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'invCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/invitationCard'),
        name: 'invCard',
        meta:{ title: '品牌—邀请卡', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'advertCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/advertisementCard'),
        name: 'advertCard',
        meta:{ title: '品牌—广告推荐', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'officialCard/:str(\\d+)',
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
        path: 'customTab/:str(\\d+)',
        component: () => import('@/views/LiveModule/customTab'),
        name: 'customTab',
        meta:{ title: '品牌—自定义菜单', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'word/:str(\\d+)',
        component: () => import('@/views/MaterialModule/word'),
        name: 'word',
        meta:{ title: '直播—文档', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'prizeSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/prizeSet'),
        name: 'prizeSet',
        meta:{ title: '直播—抽奖', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'question/:str(\\d+)',
        component: () => import('@/views/MaterialModule/question'),
        name: 'question',
        meta:{ title: '直播—问卷', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'productSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/productSet'),
        name: 'productSet',
        meta:{ title: '直播—商品', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'gift/:str(\\d+)',
        component: () => import('@/views/MaterialModule/gift'),
        name: 'gift',
        meta:{ title: '直播—礼物', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'playback/:str(\\d+)',
        component: () => import('@/views/LiveModule/PlayBack/list'),
        name: 'playback',
        meta:{ title: '回放-回放管理', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'chapter/:str(\\d+)',
        component: () => import('@/views/LiveModule/PlayBack/chapter'),
        name: 'chapter',
        meta:{ title: '回放-章节打点', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/reportsData',
        component: () => import('@/views/LiveModule/Data/reportsData'),
        name: 'reportsData',
        meta:{ title: '数据报告', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/interactionData',
        component: () => import('@/views/LiveModule/Data/interactData'),
        name: 'interactionData',
        meta:{ title: '互动统计', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/userData',
        component: () => import('@/views/LiveModule/Data/userData'),
        name: 'userData',
        meta:{ title: '用户统计', icon: '' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/interactionDetail',
        component: () => import('@/views/LiveModule/Data/interactDetail'),
        name: 'interactionDetail',
        meta:{ title: '查看数据', icon: '' , activeMenu: '/live/list'},
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
      },
      {
        path: '/accountDetail/:str(\\d+)',
        component: () => import('@/views/FinanceModule/accountDetail'),
        name: 'infoDetail',
        meta:{ title: '提现明细', icon: '' , activeMenu: '/finance/info'},
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
    meta: { title: '样式Demo', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'css-demo',
        name: 'css-demo',
        component: () => import('@/views/PlatformModule/cssDemo'),
        meta: { title: 'Tinymce富文本', icon: 'el-icon-s-home' }
      }
    ]
  },
  {
    path: '/emptyLayout',
    component: emptyLayout,
    name: 'emptyLayout',
    redirect: '/',
    hidden: true,
    children: [
      {
        path: '/live/room/:il_id',
        component: () => import('@/views/LiveModule/Room'),
        name: 'LiveRoom',
        meta: { title: '直播间' },
      },
      {
        path: '/live/watch/:il_id',
        component: () => import('@/views/LiveModule/Room/watchWrap'),
        name: 'LiveRoom',
        meta: { title: '观看直播' },
      }
    ]
  },
  { path: '*', redirect: '/warning/400', hidden: true }
];

const router = new VueRouter({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: v3Routes
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
