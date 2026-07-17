<script setup lang="ts">
onMounted(() => {
  // 这段代码只在客户端执行，服务端渲染阶段跳过
  const stored = localStorage.getItem('preference')
  if (stored) preference.value = JSON.parse(stored)
})
</script>