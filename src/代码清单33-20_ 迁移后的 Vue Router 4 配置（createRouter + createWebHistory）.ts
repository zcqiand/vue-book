// src/router/index.ts
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'

// 用 RouteRecordRaw[] 显式标注路由表类型：TS 能校验每个 component 字段
const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About }
]

// createWebHistory 取代了 mode: 'history'：历史模式需要服务端配合回退路由
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router