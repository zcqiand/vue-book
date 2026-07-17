<script setup lang="ts">
const { text, completed } = defineProps<{
  text: string
  completed: boolean
}>()

// 上报 toggle 事件，载荷为该条目切换后的完成状态
const emit = defineEmits<{
  toggle: [nextCompleted: boolean]
}>()

function handleToggle() {
  emit('toggle', !completed)
}
</script>

<template>
  <li>
    <span :style="{ textDecoration: completed ? 'line-through' : 'none' }">
      {{ text }}
    </span>
    <button type="button" @click="handleToggle">
      {{ completed ? '撤销' : '完成' }}
    </button>
  </li>
</template>