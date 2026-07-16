<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserCard from './UserCard.vue'

const isLoading = ref<boolean>(false)
const error = ref<string>('')
const users = ref<User[]>([])

interface User { id: number; name: string; role: string; avatar: string }

async function fetchUsers(): Promise<void> {
  isLoading.value = true
  error.value = ''
  try {
    const response = await fetch('/api/users')
    users.value = await response.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '未知错误'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => { fetchUsers() })
</script>

<template>
  <div class="user-list">
    <div v-if="isLoading">加载中...</div>
    <div v-else-if="error">{{ error }}</div>
    <UserCard v-for="user in users" :key="user.id" :user="user" />
  </div>
</template>