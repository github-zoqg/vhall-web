import Layout from '@/layout/index';

const router = [
  {
    path: '/material',
    component: Layout,
    redirect: '/material/word',
    meta: { auth: true, title: '资料管理', name: 'Material', icon: 'saasicon_datas_img', level: 1 },
    children: [
      {
        path: 'word',
        component: () => import('@/views/MaterialModule/word'),
        meta: { auth: true, title: '文档', name: 'wordMgr' }
      },
      {
        path: 'video',
        component: () => import('@/views/MaterialModule/video'),
        meta: { auth: true, title: '音视频', name: 'videoMgr' }
      },
      {
        path: 'question',
        component: () => import('@/views/MaterialModule/question'),
        meta: { auth: true, title: '问卷', name: 'questionMgr', auth_key: 'ui.hide_survey' }
      },
      {
        path: 'addQuestion',
        component: () => import('@/views/MaterialModule/addQuestion'),
        meta: { auth: true, title: '创建问卷', name: 'addQuestionMgr', auth_key: 'ui.hide_survey' },
        hidden: true
      },
      {
        path: 'exam',
        component: () => import('@/views/MaterialModule/ExamMgr/exam'),
        meta: { auth: true, title: '快问快答', name: 'examMgr', auth_key: 'exam' }
      },
      {
        path: 'addExam',
        component: () => import('@/views/MaterialModule/ExamMgr/addExam'),
        meta: { auth: true, title: '创建问卷', name: 'addExamMgr', auth_key: 'exam' },
        hidden: true
      },
      {
        path: 'prize',
        component: () => import('@/views/MaterialModule/prize'),
        meta: { auth: true, title: '奖品', name: 'prizeMgr', auth_key: 'ui.hide_lottery' }
      },
      {
        path: 'viewer',
        component: () => import('@/views/MaterialModule/viewer'),
        meta: { auth: true, title: '观众', name: 'viewerMgr', auth_key: 'white_list' }
      },
      {
        path: 'advertCard',
        component: () => import('@/views/LiveModule/Brands/advertisementCard'),
        meta: { auth: true, title: '广告', name: 'advertCard', auth_key: 'ad_recommend' }
      },
      {
        path: 'gift',
        component: () => import('@/views/MaterialModule/gift'),
        meta: { auth: true, title: '礼物', name: 'giftMgr', auth_key: 'ui.show_gift' }
      }
    ]
  }
];
export default router;
