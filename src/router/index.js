import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
const routes = [
  {
    path: '/',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/videoManage',
    name: 'videoManage',
    component: () => import('@/views/StatisticsModule/video.vue')
  },
  {
    path: '/VideoPreview',
    name: 'VideoPreview',
    component: () => import('@/views/StatisticsModule/VideoPreview/index.vue')
  },
  {
    path: '/docManage',
    name: 'docManage',
    component: () => import('@/views/StatisticsModule/doc.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/live/list',
    name: 'liveList',
    component: () => import('@/views/LiveModule/list.vue')
  },
  {
    path: '/live/edit',
    name: 'liveEdit',
    component: () => import('@/views/LiveModule/edit.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
