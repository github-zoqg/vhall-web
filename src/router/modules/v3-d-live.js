import Layout from "@/layout/index";

const router = [
  {
    path: '/videoTailoring',
    name: 'videoTailoring',
    component: () => import('@/views/LiveModule/PlayBack/videoTailoring')
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
        meta: {webniarType: 'live', title: '创建直播', level: 2, activeMenu: '/live/edit'}
      },
      {
        path: 'vodEdit',
        name: 'vodEdit',
        component: () => import('@/views/LiveModule/edit'),
        meta: {webniarType: 'vod', title: '创建点播', icon: 'table' , activeMenu: '/live/edit'},
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
  }
];
export default router;
