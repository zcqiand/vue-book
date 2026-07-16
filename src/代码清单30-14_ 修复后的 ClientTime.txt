<script setup lang="ts">
const currentPath = ref('/')
const now = ref('')

onMounted(() => {
  currentPath.value = window.location.pathname
  now.value = new Date().toLocaleString()
})
</script>

<template>
  <ClientOnly>
    <div>
      <p>当前路径：{{ currentPath }}</p>
      <p>当前时间：{{ now }}</p>
    </div>
    <template #fallback>
      <div>加载中...</div>
    </template>
  </ClientOnly>
</template>