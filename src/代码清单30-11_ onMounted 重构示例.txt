<script setup lang="ts">
// 错误：SSR 抛 ReferenceError
// const token = localStorage.getItem('token')

// 正确：SSR 用 null 占位，onMounted 后客户端赋值
const token = ref<string | null>(null)
onMounted(() => {
  token.value = localStorage.getItem('token')
})
</script>