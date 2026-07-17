<script setup lang="ts">
import { toRef, type Ref } from 'vue'
import { useUser } from '../composables/useUser'

interface Props {
  userId: number
}
const props = defineProps<Props>()

const userIdRef: Ref<number> = toRef(props, 'userId')
const { data, loading, error } = useUser(userIdRef)
</script>

<template>
  <div class="user-card">
    <template v-if="loading">
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line"></div>
      <div class="skeleton skeleton-line short"></div>
    </template>
    <template v-else-if="error">
      <p class="error">加载失败：{{ error.message }}</p>
      <button @click="userIdRef += 0">重试</button>
    </template>
    <template v-else-if="data">
      <h2>{{ data.name }}</h2>
      <p>{{ data.email }}</p>
    </template>
  </div>
</template>