function isLoggedIn(): boolean {
  return Boolean(localStorage.getItem('token'))
}

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    // 返回一个路由对象即等于重定向，无需调用 next()
    return {
      path: '/login',
      query: { redirect: to.fullPath },
    }
  }
  // 其余情况返回 true 或不返回，表示放行
  return true
})