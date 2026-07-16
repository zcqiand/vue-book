<script setup lang="ts">
import { inject } from 'vue'
import type { InjectionKey, Ref } from 'vue'

interface User {
  id: number
  name: string
  initial: string
}

const userKey: InjectionKey<Ref<User | null>> = Symbol('user')
const currentUser = inject(userKey)
</script>

<template>
  <div v-if="currentUser" class="sidebar-user">
    <span class="avatar">{{ currentUser.initial }}</span>
    <span class="name">{{ currentUser.name }}</span>
  </div>
</template>