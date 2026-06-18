// 修复前
const user = ref(null)

// 修复后：显式声明这个 ref 可以持有一个 User 对象或 null
const user = ref<User | null>(null)