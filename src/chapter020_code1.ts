router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    // 拦截了，但没有放行
    redirectToLogin()
    // next() 被漏掉了
  }
  next() // 正常路径
})