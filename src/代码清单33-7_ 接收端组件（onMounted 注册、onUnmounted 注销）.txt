<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { emitter } from '@/utils/emitter'

// 必须用具名函数而非匿名箭头函数：注销时需要同一个函数引用
// 写成匿名函数后，emitter.off 无法定位到要移除的处理器，导致内存泄漏
function handleLogin(payload: { userId: number; username: string }): void {
  console.log(`用户 ${payload.username}（ID: ${payload.userId}）已登录`)
}

onMounted(() => {
  emitter.on('login', handleLogin)
})

// 组件卸载时必须注销：否则组件已销毁、处理器仍挂在 emitter 上
// 下一次 login 事件触发时会调到已不存在的组件上下文，典型内存泄漏
onUnmounted(() => {
  emitter.off('login', handleLogin)
})
</script>

<template>
  <p>等待登录事件...</p>
</template>