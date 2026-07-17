<script setup lang="ts">
import { useMouse } from '../composables/useMouse'

// 调用一次，创建一个独立的状态实例
const { x, y } = useMouse()
</script>

<template>
  <p>鼠标位置：{{ x }}，{{ y }}</p>
</template>