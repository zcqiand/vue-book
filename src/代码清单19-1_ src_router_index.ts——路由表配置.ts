import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import UserListView from '../views/UserListView.vue'
import AboutView from '../views/AboutView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/users', name: 'users', component: UserListView },
  {
    path: '/users/:id',
    name: 'user-detail',
    component: UserDetailView,
  },
  { path: '/about', name: 'about', component: AboutView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router