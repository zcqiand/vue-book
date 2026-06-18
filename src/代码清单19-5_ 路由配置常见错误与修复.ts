import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import UserListView from '../views/UserListView.vue'
import UserDetailView from '../views/UserDetailView.vue'
import AboutView from '../views/AboutView.vue'

// ════════════════════════════════════════════════════════════
// 反例一：path 漏写前导斜杠
// ════════════════════════════════════════════════════════════
// 错误写法：
// const wrongRoute1: RouteRecordRaw = {
//   path: 'users/:id',        // 错误！path 应以 / 开头
//   name: 'user-detail-wrong',
//   component: UserDetailView,
// }
// TS 报错：path 必须是绝对路径（以 / 开头）

// 正确写法：
const correctRoute1: RouteRecordRaw = {
  path: '/users/:id',        // 正确：以 / 开头
  name: 'user-detail',
  component: UserDetailView,
}

// ════════════════════════════════════════════════════════════
// 反例二：component 写成字符串（应传入组件本身）
// ════════════════════════════════════════════════════════════
// 错误写法：
// const wrongRoute2: RouteRecordRaw = {
//   path: '/about',
//   name: 'about-wrong',
//   component: 'AboutView',  // 错误！component 应是组件对象，不是字符串
// }
// TS 报错：Type 'string' is not assignable to type 'ComponentRaw'

// 正确写法：
const correctRoute2: RouteRecordRaw = {
  path: '/about',
  name: 'about',
  component: AboutView,      // 正确：直接 import 后的组件对象
}

// ════════════════════════════════════════════════════════════
// 反例三：路由参数名不一致
// ════════════════════════════════════════════════════════════
// 路由表 path 定义的是 :id
// 组件里错误地读 params.userId：
// const userId = route.params.userId  // 错误！路由定义的是 :id，不是 :userId
// TS 报错：Property 'userId' does not exist

// 正确写法：params.id 与路由 path 中的 :id 完全对应
// const userId = computed<string>(() => (route.params.id as string) ?? '')