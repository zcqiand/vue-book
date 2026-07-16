import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 传对象形式：浅合并到 state
authStore.$patch({
  token: 'refreshed-token',
  profile: { id: 42, name: '南荣相如' },
})

// 传函数形式：适合基于当前值做复杂修改
authStore.$patch((state) => {
  if (state.profile) {
    state.profile.name = state.profile.name.trim()
  }
})