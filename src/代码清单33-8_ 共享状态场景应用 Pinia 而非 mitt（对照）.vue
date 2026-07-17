<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
// 解构 state/getters 必须用 storeToRefs，否则丢失响应式（详见第23章）
const { currentUser, isLoggedIn } = storeToRefs(userStore)

async function handleLogin(): Promise<void> {
  // 修改 state 后，所有引用 currentUser 的组件自动重渲染，无需手动 emit 事件
  await userStore.login({ username: 'tom', password: 'pwd123' })
}
</script>

<template>
  <p v-if="isLoggedIn">欢迎，{{ currentUser?.username }}</p>
  <button v-else @click="handleLogin">登录</button>
</template>