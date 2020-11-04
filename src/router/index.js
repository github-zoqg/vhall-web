import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
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
    path: '/live-list',
    name: 'liveList',
    component: () => import('@/views/LiveModule/list.vue')
  },
  {
    path: '/live/edit',
    name: 'liveEdit',
    component: () => import('@/views/LiveModule/edit.vue')
  },
  {
    path: '/live-detail/:str',
    title: '直播-详情',
    name: 'liveDetail',
    component: () => import('@/views/LiveModule/detail.vue')
  },
  {
    path: '/plan-function/:str',
    title: '准备——功能配置',
    name: 'planFunction',
    component: () => import('@/views/LiveModule/planFunction.vue')
  },
  {
    path: '/css-demo',
    title: '样式Demo',
    name: 'cssDemo',
    component: () => import('@/views/PlatformModule/cssDemo.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
