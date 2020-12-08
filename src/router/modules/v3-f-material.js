import Layout from "@/layout/index";

const router = [
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
  }
];
export default router;
