import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(null)
  const userInfo = ref<{ id: number; name: string } | null>(null)

  const isLoggedIn = computed(() => token.value !== null)

  async function login(username: string, password: string) {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    token.value = data.token
    userInfo.value = data.userInfo
  }

  function logout() {
    token.value = null
    userInfo.value = null
  }

  return { token, userInfo, isLoggedIn, login, logout }
})