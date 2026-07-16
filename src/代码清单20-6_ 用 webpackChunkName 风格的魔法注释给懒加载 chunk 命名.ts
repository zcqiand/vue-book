const routes = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: 'dashboard',
        component: () => import(/* @vite-ignore */ '@/views/DashboardView.vue'),
      },
      {
        path: 'users',
        // Vite 会按入口文件名生成 chunk，名字里能看到 UsersView
        component: () => import('@/views/UsersView.vue'),
      },
    ],
  },
]