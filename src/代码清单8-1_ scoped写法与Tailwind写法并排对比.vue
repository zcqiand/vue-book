<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <!-- ❶ scoped 写法：样式写在下方 <style scoped>，模板里只用语义类名占位 -->
  <div class="card">
    <div class="avatar">{{ title.charAt(0) }}</div>
    <div>
      <h3 class="title">{{ title }}</h3>
      <p class="desc">{{ description }}</p>
    </div>
  </div>

  <!-- ❷ Tailwind 写法：样式信息直接写在 class 上，无需 <style> 块 -->
  <div class="flex items-center gap-4 rounded-xl bg-white p-6 shadow-md">
    <div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
      {{ title.charAt(0) }}
    </div>
    <div>
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <p class="text-sm text-gray-500">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
/* ❸ scoped 仍需自己起类名、写选择器，靠 data-v 哈希隔离作用域 */
.card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 0.75rem;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background-color: #3b82f6;
  color: #ffffff;
  font-weight: 600;
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.desc {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>