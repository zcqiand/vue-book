import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// ❶ 通过模块扩展给 RouteMeta 加上 requiresAuth、roles、title 字段
declare module 'vue-router' {
  interface RouteMeta {
    /** 是否需要登录才能访问，true 时未登录会被重定向到 /login */
    requiresAuth?: boolean
    /** 允许访问的角色数组，未配置则不限制角色；配置后任一角色匹配即放行（OR 语义） */
    roles?: string[]
    /** 页面标题，会拼到 document.title 里 */
    title?: string
  }
}

// 完整路由表见代码清单34-2，这里只展示本章新增的两条：/forbidden 与 /admin/users
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false, title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: '工作台' }
      },
      // ❷ 新增角色受限路由：只有 admin 角色能访问
      {
        path: 'admin/users',
        name: 'admin-users',
        component: () => import('@/views/admin/UserListView.vue'),
        meta: { title: '用户管理', roles: ['admin'] }
      }
    ]
  },
  // ❸ 新增 403 页面：访问越权路由时跳到这里；与 404 区分（403 是登录了但没权限，404 是路径不存在）
  {
    path: '/forbidden',
    name: 'forbidden',
    component: () => import('@/views/ForbiddenView.vue'),
    meta: { title: '无权访问' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// ❹ beforeEach 用 async 签名：守卫里可能涉及异步（如远程拉权限），留扩展空间
// Vue Router 4 推荐 return 写法，next() 仍兼容但官方建议迁移到 return
router.beforeEach(async (to, _from) => {
  // 在守卫内部 import store 而非模块顶部，规避循环依赖（store 可能反向 import router）
  const { useAuthStore } = await import('@/stores/auth')
  const authStore = useAuthStore()

  // ❺ 第一步：刷新页面后 store 重置、token 在 localStorage 但 roles 为空
  // 这种「半恢复」状态需先调 restoreSession 把权限数据补齐，否则 hasRole 会误判
  if (authStore.token.length > 0 && authStore.roles.length === 0) {
    authStore.restoreSession()
  }

  // ❻ 第二步：requiresAuth 为 true 且未登录，跳登录页
  // query.redirect 携带原目标路径，登录成功后回跳，避免用户被打回首页
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // ❼ 第三步：路由声明了 meta.roles 但当前用户没有任何匹配角色，跳 403（OR 语义；如需 AND 改 every）
  if (to.meta.roles && to.meta.roles.length > 0) {
    const allowed = to.meta.roles.some((r) => authStore.hasRole(r))
    if (!allowed) {
      return { name: 'forbidden' }
    }
  }

  // ❽ 第四步：保留 34.8 的标题设置，meta.title 拼到 document.title
  if (to.meta.title) {
    document.title = `${to.meta.title} - 实验室管理系统`
  }

  return true
})

export default router