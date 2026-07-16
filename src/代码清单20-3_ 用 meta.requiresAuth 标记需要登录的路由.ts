{
  path: '/admin',
  component: AdminLayout,
  redirect: '/admin/dashboard',
  meta: { requiresAuth: true },
  children: [
    { path: 'dashboard', component: () => import('@/views/DashboardView.vue') },
    { path: 'users', component: () => import('@/views/UsersView.vue') },
    { path: 'settings', component: () => import('@/views/SettingsView.vue') },
  ],
}