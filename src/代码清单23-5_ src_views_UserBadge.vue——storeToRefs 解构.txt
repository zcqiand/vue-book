<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

// storeToRefs 解构：token 和 isLoggedIn 变成 ref，响应式正常
const { token, isLoggedIn } = storeToRefs(userStore)

// actions 不需要 storeToRefs，直接解构
const { login, logout } = userStore
</script>

<template>
  <div class="user-badge">
    <span v-if="isLoggedIn">
      已登录，token：{{ token?.slice(0, 10) }}...
    </span>
    <span v-else>未登录</span>
  </div>
</template>