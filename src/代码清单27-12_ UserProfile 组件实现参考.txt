<script setup lang="ts">
import { ref, watch } from 'vue'
import { fetchUser, type User } from '@/api/user'

const props = defineProps<{ userId: string }>()

const loading = ref(false)
const user = ref<User | null>(null)
const error = ref<Error | null>(null)

async function load() {
  loading.value = true
  error.value = null
  user.value = null
  try {
    user.value = await fetchUser(props.userId)
  } catch (e) {
    error.value = e as Error
  } finally {
    loading.value = false
  }
}

watch(() => props.userId, load, { immediate: true })
</script>

<template>
  <div>
    <p v-if="loading" data-test="status">加载中…</p>
    <p v-else-if="error" data-test="status">加载失败</p>
    <div v-else-if="user" data-test="user">
      <span data-test="name">{{ user.name }}</span>
      <span data-test="email">{{ user.email }}</span>
    </div>
    <button v-if="error" data-test="retry" @click="load">点击重试</button>
  </div>
</template>