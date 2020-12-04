import Vue from 'vue';
import VueRouter from 'vue-router';
// import NProgress from 'nprogress';
Vue.use(VueRouter);

// 引入布局层
import Layout from '@/layout';
import emptyLayout from '@/layout/emptyLayout';
import {sessionOrLocal} from "@/utils/utils";

// 主入口路由(需嵌套上左右整体布局)
const v3Routes = [
  {
    path: '/login',
    component: () => import('@/views/login')
  },
  {
    path: '/register',
    component: () => import('@/views/login')
  },
  {
    path: '/forgetPassword',
    component: () => import('@/views/forgetPassword')
  },
  {
    path: '/videoTailoring',
    name: 'videoTailoring',
    component: () => import('@/views/LiveModule/PlayBack/videoTailoring')
  },
  {
    path: '/special/detail',
    name: 'detail',
    component: () => import('@/views/SpecialModule/components/preShow')
  },
  {
    path: '/user/home/:str(\\d+)',
    name: 'userHome',
    component: () => import('@/views/UserHome/home'),
    meta: { title: '个人主页'},
    hidden: true
  },
  {
    path: '/user/home/set/:str(\\d+)',
    component: () => import('@/views/UserHome/homeSetInfo'),
    name: 'homeSet',
    meta:{ title: '设置'},
    hidden: true
  },
  {
    path: '/warning/:str(.+)', // 说明包含 404，500，405 ，sysUnder 系统维护中，network 网络异常
    component: () => import('@/views/PlatformModule/Error/index'),
    hidden: true
  },
  {
    path: '/code',
    component: () => import('@/views/FinanceModule/components/weixin'),
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
        meta: { title: '首页', icon: 'saasel-icon-v3-home', level: 1 }
      }
    ]
  },
  {
    path: '/live',
    component: Layout,
    redirect: '/live/list',
    name: 'Live',
    meta: { title: '直播管理', icon: 'saasel-icon-v3-lives', level: 1 },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/LiveModule/list'),
        meta: { title: '直播列表', level: 2 }
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/LiveModule/edit'),
        meta: {webniarType: 'live', title: '创建直播', level: 2, activeMenu: '/live/list'}
      },
      {
        path: 'vodEdit',
        name: 'vodEdit',
        component: () => import('@/views/LiveModule/edit'),
        meta: {webniarType: 'vod', title: '创建点播', icon: 'table' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'detail/:str(\\d+)',
        component: () => import('@/views/LiveModule/detail'),
        name: 'detail',
        meta:{ title: '直播详情' , activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'chooseWay/:str(\\d+)',
        component: () => import('@/views/LiveModule/chooseWay'),
        name: 'chooseWay',
        meta:{ title: '选择发起方式', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'signup/:str(\\d+)',
        component: () => import('@/views/LiveModule/signUp/main'),
        name: 'signup',
        meta:{ title: '准备—报名表单', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'viewerRules/:str(\\d+)',
        component: () => import('@/views/LiveModule/viewerRules'),
        name: 'viewerRules',
        meta:{ title: '准备—观看限制', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'roleInvitation/:str(\\d+)',
        component: () => import('@/views/LiveModule/roleInvitation'),
        name: 'roleInvitation',
        meta:{ title: '准备—角色邀请', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'planFunction/:str(\\d+)',
        component: () => import('@/views/LiveModule/planFunction'),
        name: 'planFunction',
        meta:{ title: '准备—功能配置', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'virtual/:str(\\d+)',
        component: () => import('@/views/LiveModule/virtual'),
        name: 'virtual',
        meta:{ title: '准备—虚拟人数', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'warm/:str(\\d+)',
        component: () => import('@/views/LiveModule/warm'),
        name: 'warm',
        meta:{ title: '准备—暖场视频', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'embedCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/embedCard'),
        name: 'embedCard',
        meta:{ title: '准备—推广嵌入', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'brandSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/brandSet'),
        name: 'brandSet',
        meta:{ title: '品牌—品牌设置', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'playerSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/playerSet'),
        name: 'playerSet',
        meta:{ title: '品牌—播放器设置', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'invCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/invitationCard'),
        name: 'invCard',
        meta:{ title: '品牌—邀请卡', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'advertCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/advertisementCard'),
        name: 'advertCard',
        meta:{ title: '品牌—广告推荐', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'officialCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/officialCard'),
        name: 'officialCard',
        meta:{ title: '品牌—公众号展示', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'posterCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/officialCard'),
        name: 'posterCard',
        meta:{ title: '品牌—开屏海报', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'customTab/:str(\\d+)',
        component: () => import('@/views/LiveModule/customTab'),
        name: 'customTab',
        meta:{ title: '品牌—自定义菜单', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'word/:str(\\d+)',
        component: () => import('@/views/MaterialModule/word'),
        name: 'word',
        meta:{ title: '直播—文档', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'prizeSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/prizeSet'),
        name: 'prizeSet',
        meta:{ title: '直播—抽奖', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'question/:str(\\d+)',
        component: () => import('@/views/MaterialModule/question'),
        name: 'question',
        meta:{ title: '直播—问卷', name: 'live', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'addQuestion',
        component: () => import('@/views/LiveModule/MaterialSet/addQuestion'),
        name: 'addQuestion',
        meta:{ title: '直播—新建问卷', name: 'live', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'productSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/productSet'),
        name: 'productSet',
        meta:{ title: '直播—商品', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'addProduct/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/components/addProduct'),
        name: 'addProduct',
        meta:{ title: '直播—新建商品', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'editProduct/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/components/addProduct'),
        name: 'editProduct',
        meta:{ title: '直播—编辑商品', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'gift/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/giftSet'),
        name: 'gift',
        meta:{ title: '直播—礼物', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'playback/:str(\\d+)',
        component: () => import('@/views/LiveModule/PlayBack/list'),
        name: 'playback',
        meta:{ title: '回放-回放管理', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'chapter/:str(\\d+)',
        component: () => import('@/views/LiveModule/PlayBack/chapter'),
        name: 'chapter',
        meta:{ title: '回放-章节打点', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/reportsData/:str(\\d+)',
        component: () => import('@/views/LiveModule/Data/reportsData'),
        name: 'reportsData',
        meta:{ title: '数据报告', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/interactionData/:str(\\d+)',
        component: () => import('@/views/LiveModule/Data/interactData'),
        name: 'interactionData',
        meta:{ title: '互动统计', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/userData/:str(\\d+)',
        component: () => import('@/views/LiveModule/Data/userData'),
        name: 'userData',
        meta:{ title: '用户统计', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/interactionDetail',
        component: () => import('@/views/LiveModule/Data/interactDetail'),
        name: 'interactionDetail',
        meta:{ title: '查看数据',  activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: '/lookSingleQuestion',
        component: () => import('@/views/LiveModule/Data/lookSingleQuestion'),
        name: 'lookSingleQuestion',
        meta:{ title: '查看问卷详情', activeMenu: '/live/list'},
        hidden: true
      }
    ]
  },
  {
    path: '/special',
    component: Layout,
    redirect: '/special/list',
    name: 'Special',
    meta: { title: '专题管理', icon: 'saasel-icon-v3-projects', level: 1 },
    children: [
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/SpecialModule/list'),
        meta: { title: '专题列表', level: 2, activeMenu: '/special/list' }
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/SpecialModule/edit'),
        meta: { title: '创建专题', level: 2, activeMenu: '/special/list' }
      }
    ]
  },
  {
    path: '/material',
    component: Layout,
    redirect: '/material/word',
    name: 'Material',
    meta: { title: '资料管理', icon: 'saasel-icon-v3-datas', level: 1 },
    children: [
      {
        path: 'word',
        name: 'word',
        component: () => import('@/views/MaterialModule/word'),
        meta: { title: '文档' }
      },
      {
        path: 'video',
        name: 'video',
        component: () => import('@/views/MaterialModule/video'),
        meta: { title: '音视频'}
      },
      {
        path: 'question',
        name: 'question',
        component: () => import('@/views/MaterialModule/question'),
        meta: { title: '问卷', name: 'material'}
      },
      {
        path: 'addQuestion',
        component: () => import('@/views/LiveModule/MaterialSet/addQuestion'),
        name: 'addQuestion',
        meta:{ title: '新建问卷', name: 'material' },
        hidden: true
      },
      {
        path: 'prize',
        name: 'prize',
        component: () => import('@/views/MaterialModule/prize'),
        meta: { title: '奖品'}
      },
      {
        path: 'viewer',
        name: 'viewer',
        component: () => import('@/views/MaterialModule/viewer'),
        meta: { title: '观众'}
      },
      {
        path: 'advertCard',
        name: 'advertCard',
        component: () => import('@/views/LiveModule/Brands/advertisementCard'),
        meta: { title: '广告推荐', name: 'material' }
      },
      {
        path: 'gift',
        name: 'gift',
        component: () => import('@/views/MaterialModule/gift'),
        meta: { title: '礼物'}
      }
    ]
  },
  {
    path: '/data',
    component: Layout,
    redirect: '/data/info',
    name: 'Data',
    meta: { title: '数据中心', icon: 'saasel-icon-v3-charts' },
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/StatisticsModule/dataInfo'),
        meta: { title: '数据总览'}
      },
      {
        path: 'live',
        name: 'live',
        component: () => import('@/views/StatisticsModule/dataLive'),
        meta: { title: '活动数据'}
      }
    ]
  },
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
  },
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
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/info',
    name: 'Account',
    meta: { title: '账户管理', icon: 'saasel-icon-v3-account' },
    children: [
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/AccountModule/info'),
        meta: { title: '账户信息'}
      },
      {
        path: 'son',
        name: 'son',
        component: () => import('@/views/AccountModule/son'),
        meta: { title: '子账号管理'}
      },
      {
        path: `http://localhost:8080/#/user/home/${sessionOrLocal.get('userId')}`,
        meta: { title: '个人主页' }
      },
      {
        path: '/allocation/:str(\\d+)',
        component: () => import('@/views/AccountModule/allocation'),
        name: 'allocation',
        meta:{ title: '用量分配', activeMenu: '/account/son'},
        hidden: true
      },
      {
        path: '/sonDetail/:str(\\d+)',
        component: () => import('@/views/AccountModule/sonDetail'),
        name: 'sonDetail',
        meta:{ title: '子账号详情', activeMenu: '/account/son'},
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
        path: 'msgDetail/:str(\\d+)',
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
      },
      {
        path: '/subscribe/:id',
        name: 'list',
        component: () => import('@/views/LiveModule/Subscribe/index'),
        meta: { title: '预约' }
      },
    ]
  },
  { path: '*', redirect: '/warning/404', hidden: true }
];

const router = new VueRouter({
  // mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: v3Routes
});
// router.beforeEach((to, from, next) => {
//   NProgress.start();
//   next();
// });
// router.afterEach(transition => {
//   console.log(transition);
//   NProgress.done();
// });
export default router;
