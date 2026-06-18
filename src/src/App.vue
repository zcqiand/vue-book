// 代码清单28-4: 父组件 — App 依赖 Pinia Store
// src/App.vue
<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from './stores/user'
import UserBadge from './components/UserBadge.vue'

const userStore = useUserStore()
const loginError = ref<string | null>(null)

async function handleLogin(username: string, password: string) {
  loginError.value = null
  try {
    await userStore.login(username, password)
  } catch (err) {
    loginError.value = err instanceof Error ? err.message : '登录失败'
  }
}
</script>

<template>
  <div class="app">
    <header>
      <h1>我的应用</h1>
      <UserBadge />
    </header>

    <main>
      <form @submit.prevent="handleLogin('tom', 'password')">
        <button type="submit">模拟登录 Tom</button>
      </form>
      <p v-if="loginError" class="error">{{ loginError }}</p>
    </main>
  </div>
</template>

<style scoped>
.app {
  padding: 16px;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.error {
  color: red;
  margin-top: 8px;
}
</style>