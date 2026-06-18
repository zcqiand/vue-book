import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 直接读写（不解构）：不需要 storeToRefs
console.log(userStore.isLoggedIn)
userStore.token = 'new-token'
await userStore.login('tom', 'password123')