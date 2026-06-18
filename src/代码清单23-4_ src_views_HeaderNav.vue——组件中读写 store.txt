<script setup lang="ts">
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

async function handleLogin(): Promise<void> {
  try {
    await userStore.login('tom', 'password123')
  } catch (err) {
    console.error('登录失败', err)
  }
}

function handleLogout(): void {
  userStore.logout()
}
</script>

<template>
  <header class="app-header">
    <div class="brand">我的应用</div>

    <div v-if="userStore.isLoggedIn" class="user-info">
      <span>{{ userStore.userInfo?.name }}</span>
      <button @click="handleLogout">退出登录</button>
    </div>

    <div v-else>
      <button @click="handleLogin">登录</button>
    </div>
  </header>
</template>

<style scoped>
.app-header { display: flex; align-items: center; padding: 12px 24px; background: #fff; border-bottom: 1px solid #e5e7eb; }
.brand { font-weight: 600; margin-right: auto; }
.user-info { display: flex; gap: 12px; align-items: center; }
</style>