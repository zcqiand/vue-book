<script setup lang="ts">
import { toRef, type Ref } from 'vue'
import { useUser } from '../composables/useUser'

interface Props {
  userId: number
}
const props = defineProps<Props>()
const userIdRef: Ref<number> = toRef(props, 'userId')

// 顶层 await 让 setup 变成 async，Suspense 会接管 loading 阶段
const { data, error } = await useUser(userIdRef)
if (error.value) throw error.value
</script>

<template>
  <article v-if="data">
    <h1>{{ data.name }}</h1>
    <p>{{ data.email }}</p>
  </article>
</template>