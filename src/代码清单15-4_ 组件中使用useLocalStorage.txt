<script setup lang="ts">
import { useLocalStorage } from '../composables/useLocalStorage'

// 泛型传入 boolean，表明这个存储值的类型是「是否深色模式」
const isDark = useLocalStorage<boolean>('user-theme-dark', false)

function toggle(): void {
  isDark.value = !isDark.value
}
</script>

<template>
  <button @click="toggle">
    当前：{{ isDark ? '深色模式' : '浅色模式' }}
  </button>
</template>