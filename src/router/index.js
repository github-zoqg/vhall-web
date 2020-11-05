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
    component: () => import('../views/StatisticsModule/video.vue')
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
  },
  {
    path: '/live/detail',
    name: 'liveDetail',
    component: () => import('@/views/LiveModule/detail.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;
