// 同步加载（所有组件打包进主 bundle，首屏体积大）
// import DashboardView from '../views/DashboardView.vue'

// 懒加载写法（独立 chunk，进入该路由时按需加载，首屏体积小）
// component: () => import('../views/DashboardView.vue')

// 完整示例：所有路由均为懒加载
const routes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/DashboardView.vue'),
      },
      {
        path: 'users',
        name: 'UserList',
        component: () => import('../views/UserListView.vue'),
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/SettingsView.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
  },
]