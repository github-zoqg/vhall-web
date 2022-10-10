import Layout from "@/layout/index";
import Detail from '@/views/LiveModule/detail'
import CustomerTab from '@/views/LiveModule/CustomerTabView'

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
    path: '/previewChapter/:str(\\d+)',
    component: () => import('@/views/LiveModule/PlayBack/previewChapter'),
    meta:{ auth: true, title: '回放-章节预览', name: 'previewChapter', activeMenu: '/live/list'},
    hidden: true
  },
  {
    path: '/chapter/:str(\\d+)',
    component: () => import('@/views/LiveModule/PlayBack/chapter'),
    meta:{ auth: true, title: '章节打点', name: 'chapter', activeMenu: '/live/list'},
    hidden: true
  },
  {
    path: '/recordchapter/:str(\\d+)',
    component: () => import('@/views/LiveModule/PlayBack/chapter'),
    meta:{ auth: true, title: '章节打点', name: 'recordchapter', activeMenu: '/live/list'},
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
        meta: { auth: true, title: '直播列表', level: 2 , name: 'liveList'}
      },
      {
        path: 'edit',
        component: () => import('@/views/LiveModule/edit'),
        meta: { auth: true, title: '创建直播', level: 2 , name: 'liveCreate', webinarType: 'live', activeMenu: '/live/edit'},
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/LiveModule/edit'),
        meta: { auth: true, title: '编辑直播', level: 2 , name: 'liveEdit', webinarType: 'live', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'vodEdit/:id',
        component: () => import('@/views/LiveModule/edit'),
        meta: { auth: true, title: '编辑点播', name: 'vodEdit', webinarType: 'vod', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'vodEdit',
        component: () => import('@/views/LiveModule/edit'),
        meta: { auth: true, title: '创建点播', name: 'vodCreate', webinarType: 'vod', activeMenu: '/live/vodEdit', auth_key: 'ui.upload_video_as_demand'},
      },
      {
        path: 'timeEdit',
        component: () => import('@/views/LiveModule/edit'),
        meta: { auth: true, title: '定时直播', level: 2 , name: 'liveTimeCreate', webinarType: 'time', activeMenu: '/live/timeEdit',auth_key: 'webinar.timing'},
      },
      {
        path: 'timeEdit/:id',
        component: () => import('@/views/LiveModule/edit'),
        meta: { auth: true, title: '编辑定时直播', level: 2 , name: 'liveTimeEdit', webinarType: 'time', activeMenu: '/live/timeEdit'},
        hidden: true
      },
      {
        path: 'detail/:str(\\d+)',
        component: Detail,
        meta: { auth: true, title: '直播详情', name: 'liveDetail', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'chooseWay/:str/:role?',
        component: () => import('@/views/LiveModule/chooseWay'),
        meta: { auth: true, title: '选择发起方式', name: 'chooseWay', level: 3, activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'signup/:str(\\d+)',
        component: () => import('@/views/LiveModule/signUp/main'),
        meta:{ auth: true, title: '报名表单', name: 'signup', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'viewerRules/:str(\\d+)',
        component: () => import('@/views/LiveModule/viewerRules'),
        meta:{ auth: true, title: '观看限制', name: 'viewerRules', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'roleInvitation/:str(\\d+)',
        component: () => import('@/views/LiveModule/roleInvitation'),
        meta:{ auth: true, title: '角色邀请', name: 'roleInvitation', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'planFunction/:str(\\d+)',
        component: () => import('@/views/LiveModule/planFunction'),
        meta:{ auth: true, title: '功能配置', name: 'planFunction', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'virtual/:str(\\d+)',
        component: () => import('@/views/LiveModule/virtual'),
        meta:{ auth: true,  title: '虚拟人数', name: 'virtual', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'warm/:str(\\d+)',
        component: () => import('@/views/LiveModule/warm'),
        meta:{ auth: true,  title: '暖场视频', name: 'warm', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'embedCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/embedCard'),
        meta:{ auth: true, title: '推广嵌入', name: 'embedCard', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'langCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/langCard'),
        meta:{ auth: true, title: '多语言', name: 'langCard', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'livingSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/livingSetting'),
        meta:{ auth: true, title: '直播间设计器', name: 'livingSetting', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'safeScreenSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/safeScreenSet'),
        meta:{ auth: true, title: '防录屏设置', name: 'safeScreenSet', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'playerSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/playerSet'),
        meta:{ auth: true, title: '播放器设置', name: 'playerSet', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'invCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/invitationCard'),
        meta:{ auth: true, title: '邀请卡', name: 'invCard', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'advertCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/advertisementCard'),
        meta:{ auth: true, title: '广告', name: 'advertCard', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'officialCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/officialCard'),
        meta:{ auth: true, title: '公众号展示', name: 'officialCard', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'officeSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/officialCard'),
        meta:{ auth: true, title: '公众号', name: 'officeSet', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'posterCard/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/posterCard'),
        meta:{ auth: true, title: '开屏海报', name: 'posterSet', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'shareSetting/:str(\\d+)',
        component: () => import('@/views/LiveModule/Brands/shareSetting'),
        meta:{ auth: true, title: '分享设置', name: 'shareSet', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'word/:str(\\d+)',
        component: () => import('@/views/MaterialModule/word'),
        meta:{ auth: true, title: '文档', name: 'word', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'videoSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/videoSet'),
        meta:{ auth: true, title: '插播文件', name: 'videoSet', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'prizeSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/prizeSet'),
        meta:{ auth: true, title: '抽奖', name: 'prizeSet', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'question/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/question'),
        meta:{ auth: true, title: '问卷', name: 'question', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'addQuestion',
        component: () => import('@/views/LiveModule/MaterialSet/components/addQuestion'),
        meta:{ auth: true, title: '创建问卷', name: 'addQuestion', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'productSet/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/productSet'),
        meta:{ auth: true, title: '商品', name: 'productSet', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'addProduct/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/components/addProduct'),
        meta:{ auth: true, title: '创建商品', name: 'addProduct', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'editProduct/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/components/addProduct'),
        meta:{ auth: true, title: '编辑商品', name: 'editProduct', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'gift/:str(\\d+)',
        component: () => import('@/views/LiveModule/MaterialSet/giftSet'),
        meta:{ auth: true, title: '礼物', name: 'gift', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'playback/:str(\\d+)',
        component: () => import('@/views/LiveModule/PlayBack/list'),
        meta:{ auth: true, title: '回放管理', name: 'playback', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'playback/:str(\\d+)/group/:switch_id(\\d+)',
        component: () => import('@/views/LiveModule/PlayBack/groupList'),
        meta:{ auth: true, title: '小组视频', name: 'playbackGroupList', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'recordplayback/:str(\\d+)',
        component: () => import('@/views/LiveModule/PlayBack/list'),
        meta:{ auth: true, title: '点播管理', name: 'recordplayback', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'publishplayback/:str(\\d+)',
        component: () => import('@/views/LiveModule/PlayBack/list'),
        meta:{ auth: true, title: '视频管理', name: 'publishplayback', activeMenu: '/live/list'},
        hidden: true
      },
      {
        path: 'vodreset/:str(\\d+)',
        component: () => import('@/views/LiveModule/PlayBack/vodreset'),
        meta:{ auth: true, title: '课件重制', name: 'vodreset', activeMenu: '/live/list'},
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
    meta: { auth: true, title: '专题管理', name: 'specialList', icon: 'saasicon_projects', level: 1, auth_key: 'subject_manager' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/SpecialModule/list'),
        meta: { auth: true, title: '专题列表', name: 'specialList', level: 2, activeMenu: '/special/list', auth_key: 'subject_manager' }
      },
      {
        path: 'edit',
        component: () => import('@/views/SpecialModule/edit'),
        meta: { auth: true, title: '创建专题', name: 'subjectEdit', level: 2, activeMenu: '/special/edit', auth_key: 'subject_manager' }
      },
      {
        path: 'edit/:id',
        component: () => import('@/views/SpecialModule/edit'),
        meta: { auth: true, title: '编辑专题', name: 'subjectEdit', level: 2, activeMenu: '/special/list', auth_key: 'subject_manager' },
        hidden: true
      },
      {
        path: 'data/:id',
        component: () => import('@/views/SpecialModule/data'),
        meta: { auth: true, title: '查看数据', name: 'subjectData', level: 2, activeMenu: '/special/list', auth_key: 'subject_manager'},
        hidden: true
      },
      {
        path: 'viewer/:id',
        component: () => import('@/views/SpecialModule/viewer'),
        meta: { auth: true, title: '观看限制', name: 'subjectViewer', level: 2, activeMenu: '/special/list', auth_key: 'subject_manager'},
        hidden: true
      },
      {
        path: 'details/:id',
        component: () => import('@/views/SpecialModule/details'),
        meta: { auth: true, title: '专题详情', name: 'subjectDetails', level: 2, activeMenu: '/special/list', auth_key: 'subject_manager' },
        hidden: true
      }
    ]
  },
  {
    path: '/chooseWay/:str/:role?',
    component: () => import('@/views/LiveModule/chooseWay'),
    meta: { auth: true, title: '选择发起方式', name: 'chooseWay'},
    hidden: true
  },
  {
    // 该路由已废弃
    path: '/special/detail',
    meta: { title: '个人专题详情', name: 'specialPreview'},
    component: () => import('@/views/SpecialModule/components/preShow'),
    hidden: true
  }
];
export default router;
