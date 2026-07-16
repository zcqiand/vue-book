// 全局前置守卫（ch35）：登录态校验 + 角色校验。
// 守卫逻辑抽成函数，方便单测里 applyAuthGuard(testRouter) 复用同一份逻辑。
export function applyAuthGuard(target: import('vue-router').Router) {
  target.beforeEach(async (to) => {
    if (to.meta.title) document.title = `${to.meta.title} - 实验室管理系统`
    const meta = to.meta as AppRouteMeta
    if (!meta.requiresAuth) return true

    const auth = useAuthStore()
    // 进入受保护页面前从 localStorage 恢复登录态（首次刷新页面场景）
    if (!auth.isAuthenticated) {
      auth.restore()
    }
    if (!auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (meta.roles && meta.roles.length > 0 && !meta.roles.includes(auth.role)) {
      return { name: 'forbidden' }
    }
    return true
  })
}