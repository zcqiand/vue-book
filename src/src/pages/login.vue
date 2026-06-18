// 代码清单35-5: 登录页完整实现
// src/pages/login.vue
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
const username = ref('')
const password = ref('')

async function handleLogin() {
  await userStore.login(username.value, password.value)
  router.push('/')
}
</script>
<template>
  <form @submit.prevent="handleLogin">
    <input v-model="username" placeholder="用户名" />
    <input v-model="password" type="password" placeholder="密码" />
    <button type="submit">登录</button>
  </form>
</template>