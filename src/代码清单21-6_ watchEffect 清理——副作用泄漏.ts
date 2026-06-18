// 错误写法（注释掉）：
// watchEffect(async () => {
//   const id = currentId.value
//   const data = await fetchUser(id)
//   userData.value = data  // 组件卸载后仍会执行，导致 setState on unmounted
// })

// 正确写法：在 onCleanup 中取消请求
import { ref, watchEffect, onCleanup } from 'vue'

const userData = ref<User | null>(null)
let controller: AbortController | null = null

watchEffect(() => {
  const id = currentId.value
  if (!id) return

  controller = new AbortController()

  fetchUser(id, controller.signal)
    .then((data) => {
      userData.value = data
    })
    .catch((err) => {
      if (err.name !== 'AbortError') {
        console.error('请求失败', err)
      }
    })

  // 清理函数：组件卸载或 watchEffect 重新运行时执行
  onCleanup(() => {
    controller?.abort()
  })
})