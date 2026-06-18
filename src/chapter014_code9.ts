// 响应式控制：用响应式状态决定按钮是否显示
const isLoading = ref(false)
async function fetchData() {
  isLoading.value = true
  const res = await api.get()
  items.value = res.data
  isLoading.value = false
}