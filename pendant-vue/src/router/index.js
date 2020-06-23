import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/index' },
  {
    path: '/index',
    name: 'index',
    component: () => import('../views/index.vue')
  },
  {
    path: '/live2d',
    name: 'live2d',
    component: () => import('../views/live2d')
  }
]

const router = new VueRouter({
  routes
})

export default router
