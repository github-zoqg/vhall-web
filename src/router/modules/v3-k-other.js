import Layout from "@/layout/index";
import {sessionOrLocal} from "@/utils/utils";

const router = [
  {
    path: '/other',
    component: Layout,
    redirect: '/other/msgList',
    meta: { auth: true, title: '辅助业务', name: 'other', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'msgList',
        component: () => import('@/views/PlatformModule/Message/list'),
        meta: { auth: true, title: '消息中心', name: 'msgList', icon: 'table'}
      },
      {
        path: 'msgDetail/:str(\\d+)',
        component: () => import('@/views/PlatformModule/Message/detail'),
        meta: { auth: true, title: '消息详情', name: 'msgDetail', icon: 'table', activeMenu: '/other/msgList'},
        hidden: true
      },
      {
        path: 'downloadList',
        component: () => import('@/views/PlatformModule/download'),
        meta: { auth: true, title: '下载中心', name: 'downloadList', icon: 'table'}
      }
    ]
  },
  {
    path: '/css-demo',
    component: Layout,
    meta: { auth: false, title: '样式Demo', name: 'cssDemoAll', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'css-demo',
        name: 'css-demo',
        component: () => import('@/views/PlatformModule/cssDemo'),
        meta: { auth: false, title: 'Tinymce富文本', name: 'cssDemo', icon: 'el-icon-s-home' }
      }
    ]
  }
];
export default router;
