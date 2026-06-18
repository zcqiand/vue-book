// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import type { Component } from 'vue'

// 同步组件（首屏必需）
import HomeView from './views/HomeView.vue'

// 错误写法（注释掉）：
// import UserList from './views/UserList.vue'     // 同步导入，所有用户首屏都下载
// import ProductDetail from './views/ProductDetail.vue'
// import OrderHistory from './views/OrderHistory.vue'

// 正确写法：defineAsyncComponent + 动态 import()
// 每个路由组件会被拆分为独立 chunk，访问时才加载
const UserList = defineAsyncComponent(() => import('./views/UserList.vue'))
const ProductDetail = defineAsyncComponent(() => import('./views/ProductDetail.vue'))
const OrderHistory = defineAsyncComponent(() => import('./views/OrderHistory.vue'))
const NotFound = defineAsyncComponent(() => import('./views/NotFound.vue'))

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,  // 首屏组件，同步导入
  },
  {
    path: '/users',
    name: 'user-list',
    // 懒加载：用户访问 /users 时，浏览器才请求 UserList.vue 的 chunk
    component: () => import('./views/UserList.vue'),
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    // 懒加载：访问 /products/123 时加载
    component: () => import('./views/ProductDetail.vue'),
  },
  {
    path: '/orders',
    name: 'order-history',
    // 懒加载：访问 /orders 时加载
    component: () => import('./views/OrderHistory.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('./views/NotFound.vue'),
  },
]

// 路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router