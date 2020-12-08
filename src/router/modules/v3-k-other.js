import Layout from "@/layout/index";
import {sessionOrLocal} from "@/utils/utils";

const router = [
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
        path: 'downloadList',
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
  }
];
export default router;
