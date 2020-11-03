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
    component: () => import('../views/DataManagement/video.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/live/list',
    name: 'liveList',
    component: () => import('@/views/LiveManage/list.vue')
  },
  {
    path: '/live/edit',
    name: 'liveEdit',
    component: () => import('@/views/LiveManage/edit.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
