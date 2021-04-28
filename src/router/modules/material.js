import Layout from "@/layout/index";

const router = [
  {
    path: '/material',
    component: Layout,
    redirect: '/material/word',
    meta: { auth: true, title: '资料管理', name: 'Material', icon: 'saasicon_datas', level: 1 },
    children: [
      {
        path: 'word',
        component: () => import('@/views/MaterialModule/word'),
        meta: { auth: true, title: '文档', name: 'wordMgr', k: 100510}
      },
      {
        path: 'video',
        component: () => import('@/views/MaterialModule/video'),
        meta: { auth: true, title: '音视频', name: 'videoMgr', k: 100517}
      },
      {
        path: 'question',
        component: () => import('@/views/MaterialModule/question'),
        meta: { auth: true, title: '问卷', name: 'questionMgr', auth_key: 'ui.hide_survey', k: 100525}
      },
      {
        path: 'addQuestion',
        component: () => import('@/views/MaterialModule/addQuestion'),
        meta:{ auth: true, title: '创建问卷', name: 'addQuestionMgr', auth_key: 'ui.hide_survey'},
        hidden: true
      },
      {
        path: 'prize',
        component: () => import('@/views/MaterialModule/prize'),
        meta: { auth: true, title: '奖品', name: 'prizeMgr', auth_key: 'ui.hide_lottery', k: 100533}
      },
      {
        path: 'viewer',
        component: () => import('@/views/MaterialModule/viewer'),
        meta: { auth: true, title: '观众', name: 'viewerMgr', auth_key: 'white_list', k: 100540}
      },
      {
        path: 'advertCard',
        component: () => import('@/views/LiveModule/Brands/advertisementCard'),
        meta: { auth: true, title: '广告', name: 'advertCard', auth_key: 'ad_recommend', k: 100550}
      },
      {
        path: 'gift',
        component: () => import('@/views/MaterialModule/gift'),
        meta: { auth: true, title: '礼物', name: 'giftMgr', auth_key: 'ui.show_gift', k: 100556}
      }
    ]
  }
];
export default router;
