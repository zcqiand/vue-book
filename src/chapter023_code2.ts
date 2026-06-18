export const useUserStore = defineStore('user', () => {
  // state
  const token = ref<string | null>(null)
  const userInfo = ref<UserInfo | null>(null)

  // getters（computed）
  const isLoggedIn = computed(() => !!token.value)

  // actions（普通函数，可 async）
  async function login(username: string, password: string): Promise<void> {
    const res = await fetch('/api/login', { method: 'POST' })
    token.value = res.token
    userInfo.value = res.user
  }

  function logout(): void {
    token.value = null
    userInfo.value = null
  }

  return { token, userInfo, isLoggedIn, login, logout }
})