<script setup lang="ts">
import { ref } from 'vue'

// ❶ 用联合字面量类型约束状态取值，避免拼写错误
type AuthState = 'guest' | 'loading' | 'loggedIn'

const authState = ref<AuthState>('guest')
const username = ref<string>('')

// 模拟登录：先 loading，1 秒后切换为 loggedIn
function handleLogin(): void {
  authState.value = 'loading'
  setTimeout(() => {
    username.value = '南荣相如'
    authState.value = 'loggedIn'
  }, 1000)
}

function handleLogout(): void {
  username.value = ''
  authState.value = 'guest'
}
</script>

<template>
  <div class="auth-status">
    <!-- ❷ v-if / v-else-if / v-else 构成一条分支链，同一时刻只渲染一个分支 -->
    <div v-if="authState === 'guest'">
      <span>请先登录</span>
      <button @click="handleLogin">去登录</button>
    </div>

    <div v-else-if="authState === 'loading'">
      <span>登录中...</span>
    </div>

    <div v-else>
      <span>欢迎回来，{{ username }}</span>
      <button @click="handleLogout">退出登录</button>
    </div>
  </div>
</template>