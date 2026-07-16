import { shallowRef, triggerRef } from 'vue'
import type { User } from '@/types'

// 优化前（注释保留对照）：ref 深层代理一万行，初始化遍历开销大
// const users = ref<User[]>([])

// 优化后：shallowRef 只追踪 .value 整体替换
const users = shallowRef<User[]>([])

async function loadUsers(): Promise<void> {
  const res = await fetch('/api/users')
  const data: User[] = await res.json()
  // 整体替换：Vue 不遍历一万行，只发一次「value 变了」的通知
  users.value = data
}

// 若确实需要原地改某一行（少数场景），用 triggerRef 手动通知
function markVip(index: number): void {
  users.value[index].vip = true
  triggerRef(users) // 手动触发一次更新，因为 shallowRef 不会自动感知
}