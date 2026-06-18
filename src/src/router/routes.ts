// 代码清单35-3: 路由表中的 meta 权限声明
// src/router/routes.ts
const routes = [
  {
    path: '/admin',
    component: () => import('@/layouts/Admin.vue'),
    children: [
      {
        path: 'users',
        name: 'UserManagement',
        component: () => import('@/pages/users.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/settings.vue'),
        meta: { requiresAuth: true, roles: ['admin'] },
      },
    ],
  },
  { path: '/login', name: 'Login', component: () => import('@/pages/login.vue') },
]