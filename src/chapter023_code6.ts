import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const { token, isLoggedIn } = storeToRefs(userStore)
// token 现在是 ref，响应式正常
console.log(token.value)  // 正确读取
token.value = 'new-token'  // 正确写入，响应式追踪