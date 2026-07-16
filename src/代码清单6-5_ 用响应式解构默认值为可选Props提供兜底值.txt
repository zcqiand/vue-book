<script setup lang="ts">
// 解构时直接赋默认值；variant 不传时为 'default'，size 不传时为 'md'
const { label, variant = 'default', size = 'md' } = defineProps<{
  label: string // 必选：徽章文字
  variant?: 'default' | 'success' | 'danger' // 可选：颜色变体，限定联合类型
  size?: 'sm' | 'md' | 'lg' // 可选：尺寸
}>()
</script>

<template>
  <!-- 解构出的 variant、size 仍是响应式的，父组件改值后这里会自动更新 -->
  <span :class="['badge', `badge-${variant}`, `badge-${size}`]">
    {{ label }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.badge-success {
  color: #16a34a;
  background: #dcfce7;
}
.badge-danger {
  color: #dc2626;
  background: #fee2e2;
}
.badge-sm {
  font-size: 10px;
}
.badge-lg {
  font-size: 14px;
}
</style>