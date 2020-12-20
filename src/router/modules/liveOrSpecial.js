import Layout from "@/layout/index";

const router = [
  {
    path: '/videoTailoring/:str(\\d+)',
    meta: { auth: true, title: '', name: 'videoTailoring'},
    component: () => import('@/views/LiveModule/PlayBack/videoTailoring'),
    hidden: true
  },
  {
    path: '/clientLiveEdit',
    meta: { auth: false, title: '', name: 'clientLiveEdit'},
    component: () => import('@/views/LiveModule/edit'),
    hidden: true
  },
  {
    path: '/live',
    component: Layout,
    redirect: '/live/list',
    meta: { auth: true, title: '直播管理', icon: 'saasicon_lives', level: 1 , name: 'liveMgr'},
    children: [
      {
        path: 'list',
        component: () => import('@/views/LiveModule/list'),
        meta: { auth: true, title: '直播列表', level: 2 , name: 'liveList'},
      },
      {
        path: 'edit',
        component: () => import('@/views/LiveModule/edit'),
        meta: { auth: true, title: '创建直播', level: 2 , name: 'liveEdit', webniarType: 'live', activeMenu: '/live/edit' },
      },
      {
        path: 'vodEdit',
        component: () => import('@/views/LiveModule/edit'),
        meta: { auth: true, title: '创建点播', name: 'liveEdit', webniarType: 'vod', activeMenu: '/live/edit' },
        hidden: true
      },
      {
        path: 'detail/:str(\\d+)',
        component: () => import('@/views/LiveModule/detail'),
        meta: { auth: true, title: '直播详情', name: 'liveDetail', activeMenu: '/live/list' },
        hidden: true
      },
      {
        path: 'chooseWay/:str',
        component: () => import('@/views/LiveModule/chooseWay'),
        meta: { auth: true, title: '选择发起方式', name: 'chooseWay', activeMenu: '/live/list' },
        hidden: true
      },
      {
        path: 'signup/:str(\\d+)',
        component: () => import('@/views/LiveModule/signUp/main'),
        meta:{ auth: true, title: '准备—报名表单', name: 'signup', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'viewerRules/:str(\\d+)',
        component: () => import('@/views/LiveModule/viewerRules'),
        meta:{ auth: true, title: '准备—观看限制', name: 'viewerRules', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'roleInvitation/:str(\\d+)',
        component: () => import('@/views/LiveModule/roleInvitation'),
        meta:{ auth: true, title: '准备—角色邀请', name: 'roleInvitation', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'planFunction/:str(\\d+)',
        component: () => import('@/views/LiveModule/planFunction'),
        meta:{ auth: true, title: '准备—功能配置', name: 'planFunction', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'virtual/:str(\\d+)',
        component: () => import('@/views/LiveModule/virtual'),
        meta:{ auth: true,  title: '准备—虚拟人数', name: 'virtual', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'warm/:str(\\d+)',
        component: () => import('@/views/LiveModule/warm'),
        meta:{ auth: true,  title: '准备—暖场视频', name: 'warm', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'embedCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/embedCard'),
        meta:{ auth: true, title: '准备—推广嵌入', name: 'embedCard', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'brandSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/brandSet'),
        meta:{ auth: true, title: '品牌—品牌设置', name: 'brandSet', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'playerSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/playerSet'),
        meta:{ auth: true, title: '品牌—播放器设置', name: 'playerSet', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'invCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/invitationCard'),
        meta:{ auth: true, title: '品牌—邀请卡', name: 'invCard', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'advertCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/advertisementCard'),
        meta:{ auth: true, title: '品牌—广告推荐', name: 'advertCard', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'officialCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/officialCard'),
        meta:{ auth: true, title: '品牌—公众号展示', name: 'officialCard', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'posterCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/officialCard'),
        meta:{ auth: true, title: '品牌—开屏海报', name: 'posterCard', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'customTab/:str(\\d+)',
        component: () => import('@/views/LiveModule/customTab'),
        meta:{ auth: true, title: '品牌—自定义菜单', name: 'customTab', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'word/:str(\\d+)',
        component: () => import('@/views/MaterialModule/word'),
        meta:{ auth: true, title: '直播—文档', name: 'word', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'prizeSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/prizeSet'),
        meta:{ auth: true, title: '直播—抽奖', name: 'prizeSet', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'question',
        component: () => import('@/views/LiveModule/MaterialSet/question'),
        meta:{ auth: true, title: '直播—问卷', name: 'question', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'addQuestion',
        component: () => import('@/views/LiveModule/MaterialSet/components/addQuestion'),
        meta:{ auth: true, title: '直播—新建问卷', name: 'addQuestion', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'productSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/productSet'),
        meta:{ auth: true, title: '直播—商品', name: 'productSet', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'addProduct/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/components/addProduct'),
        meta:{ auth: true, title: '直播—新建商品', name: 'addProduct', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'editProduct/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/components/addProduct'),
        meta:{ auth: true, title: '直播—编辑商品', name: 'editProduct', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'gift/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/giftSet'),
        meta:{ auth: true, title: '直播—礼物', name: 'gift', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'playback/:str(\\d+)',
        component: () => import('@/views/LiveModule/PlayBack/list'),
        meta:{ auth: true, title: '回放-回放管理', name: 'playback', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'chapter/:str(\\d+)',
        component: () => import('@/views/LiveModule/PlayBack/chapter'),
        meta:{ auth: true, title: '回放-章节打点', name: 'chapter', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'reportsData/:str(\\d+)',
        component: () => import('@/views/LiveModule/Data/reportsData'),
        meta:{ auth: true, title: '数据报告', name: 'reportsData', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'interactionData/:str(\\d+)',
        component: () => import('@/views/LiveModule/Data/interactData'),
        meta:{ auth: true, title: '互动统计', name: 'interactionData', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'userData/:str(\\d+)',
        component: () => import('@/views/LiveModule/Data/userData'),
        meta:{ auth: true, title: '用户统计', name: 'userData', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'interactionDetail',
        component: () => import('@/views/LiveModule/Data/interactDetail'),
        meta:{ auth: true, title: '查看数据', name: 'interactionDetail', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'lookSingleQuestion/:str(\\d+)',
        component: () => import('@/views/LiveModule/Data/lookSingleQuestion'),
        meta:{ auth: true, title: '查看问卷详情', name: 'lookSingleQuestion', activeMenu: '/live/list'},
        hidden: true
      }
    ]
  },
  {
    path: '/special',
    component: Layout,
    redirect: '/special/list',
    meta: { auth: true, title: '专题管理', name: 'Special', icon: 'saasicon_projects', level: 1 },
    children: [
      {
        path: 'list',
        component: () => import('@/views/SpecialModule/list'),
        meta: { auth: true, title: '专题列表', name: 'specialList', level: 2, activeMenu: '/special/list' }
      },
      {
        path: 'edit',
        component: () => import('@/views/SpecialModule/edit'),
        meta: { auth: true, title: '创建专题', name: 'specialEdit', level: 2, activeMenu: '/special/list' }
      }
    ]
  },
  {
    path: '/chooseWay/:str',
    component: () => import('@/views/LiveModule/chooseWay'),
    meta: { auth: true, title: '选择发起方式', name: 'chooseWay'},
    hidden: true
  }
];
export default router;
