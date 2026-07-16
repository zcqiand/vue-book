// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/users' },
  // 首屏要用的列表页可以保持同步加载
  { path: '/users', component: () => import('@/views/UserList.vue') },
  { path: '/users/:id', component: () => import('@/views/UserDetail.vue') },
  // 重量级统计页：独立 chunk，访问时才加载
  { path: '/stats', component: () => import('@/views/Statistics.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})