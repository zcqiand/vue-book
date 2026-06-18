// 反例（❌ 已注释，实际运行会卡死）
// router.beforeEach((to, from) => {
//   if (to.meta.requiresAuth && !localStorage.getItem('token')) {
//     // 忘记调用 next() → 导航永远卡住，页面不跳转
//     return
//   }
// })

// 正确写法：显式调用 next()
function isLoggedIn(): boolean {
  return localStorage.getItem('token') !== null
}

const router = createRouter({
  history: createWebHistory(),
  routes: [],
})

// 正确写法 ❶：显式调用 next()
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next({ name: 'Login' })
  } else {
    next()
  }
})

// 正确写法 ❷：返回目标路由对象（Vue Router 4.5+ 支持）
// router.beforeEach((to, _from) => {
//   if (to.meta.requiresAuth && !isLoggedIn()) {
//     return { name: 'Login' }
//   }
//   return true
// })