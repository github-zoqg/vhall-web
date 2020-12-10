import Layout from "@/layout/index";

const router = [
  {
    path: '/material',
    component: Layout,
    redirect: '/material/word',
    meta: { auth: true, title: '资料管理', name: 'Material', icon: 'saasel-icon-v3-datas', level: 1 },
    children: [
      {
        path: 'word',
        component: () => import('@/views/MaterialModule/word'),
        meta: { auth: true, title: '文档', name: 'wordMgr' }
      },
      {
        path: 'video',
        component: () => import('@/views/MaterialModule/video'),
        meta: { auth: true, title: '音视频', name: 'videoMgr'}
      },
      {
        path: 'question',
        component: () => import('@/views/MaterialModule/question'),
        meta: { auth: true, title: '问卷', name: 'questionMgr'}
      },
      {
        path: 'addQuestion',
        component: () => import('@/views/MaterialModule/addQuestion'),
        meta:{ auth: true, title: '新建问卷', name: 'addQuestionMgr' },
        hidden: true
      },
      {
        path: 'prize',
        component: () => import('@/views/MaterialModule/prize'),
        meta: { auth: true, title: '奖品', name: 'prizeMgr'}
      },
      {
        path: 'viewer',
        component: () => import('@/views/MaterialModule/viewer'),
        meta: { auth: true, title: '观众', name: 'viewerMgr'}
      },
      {
        path: 'advertCard',
        component: () => import('@/views/LiveModule/Brands/advertisementCard'),
        meta: { auth: true, title: '广告推荐', name: 'advertCard'}
      },
      {
        path: 'gift',
        component: () => import('@/views/MaterialModule/gift'),
        meta: { auth: true, title: '礼物', name: 'giftMgr' }
      }
    ]
  }
];
export default router;
