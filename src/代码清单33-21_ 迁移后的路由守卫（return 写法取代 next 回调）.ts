// 登录态校验示例：Vue Router 4 推荐 return false / return '/login'
router.beforeEach((to, from) => {
  const isLoggedIn = localStorage.getItem('token') !== null

  // 必须登录才能访问的页面：未登录直接重定向到 /login
  if (to.meta.requiresAuth && !isLoggedIn) {
    // return 一个路由位置对象等价于 next('/login')，但写法更直观
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  // 不需要拦截：什么都不 return，等价于 next()
})