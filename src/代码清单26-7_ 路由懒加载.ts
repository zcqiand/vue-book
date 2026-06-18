// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    // 懒加载：进入该路由时才加载 Dashboard chunk
    component: () => import('./views/Dashboard.vue'),
  },
  {
    path: '/users',
    component: () => import('./views/UserList.vue'),
  },
  {
    path: '/users/:id',
    component: () => import('./views/UserDetail.vue'),
  },
  {
    path: '/settings',
    component: () => import('./views/Settings.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router