export const useUserStore = defineStore('user', {
  state: () => ({
    token: null,
    userInfo: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    async login(username, password) {
      const res = await fetch('/api/login', { method: 'POST' })
      this.token = res.token
      this.userInfo = res.user
    },
    logout() {
      this.token = null
      this.userInfo = null
    },
  },
})