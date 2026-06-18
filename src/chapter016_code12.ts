interface User {
  id: number
  name: string
  role: 'admin' | 'editor' | 'viewer'
}

// 当返回联合类型时，显式标注可以防止类型扩散
const currentUser = computed<User | null>(() => {
  if (!userList.value.length) return null
  return userList.value.find(u => u.id === currentId.value) ?? null
})