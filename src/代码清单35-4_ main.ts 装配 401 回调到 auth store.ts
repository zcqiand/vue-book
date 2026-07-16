onUnauthorized(() => {
  // 运行时动态读取 auth store；测试/SSR 下 window 可能不存在，做兜底。
  if (typeof window !== 'undefined') {
    void import('./stores/auth').then(({ useAuthStore }) => {
      useAuthStore().handleUnauthorized()
    })
  }
})