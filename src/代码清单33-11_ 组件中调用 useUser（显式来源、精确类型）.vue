<script setup lang="ts">
import { onMounted } from 'vue'
import { useUser } from '@/composables/useUser'

// 解构出来的 user 是 ref：来源、类型、响应式特性都写在调用处，读者无需翻找 Mixin
// 若另一处也定义了 user，组件内会立即报「重复声明」错误，编译期拦截
const { user, isAdmin, loading, errorMessage, fetchUser } = useUser()

onMounted(() => {
  fetchUser(1)
})
</script>

<template>
  <p v-if="loading">加载中...</p>
  <p v-else-if="errorMessage" class="error">{{ errorMessage }}</p>
  <div v-else-if="user">
    <p>姓名：{{ user.name }}</p>
    <p>角色：{{ isAdmin ? '管理员' : '普通成员' }}</p>
    <button @click="fetchUser(user.id)">刷新</button>
  </div>
</template>