<script setup lang="ts">
import { shallowRef } from 'vue'
import type { User } from '@/types'
const users = shallowRef<User[]>([])
</script>

<template>
  <div
    v-for="user in users"
    :key="user.id"
    v-memo="[user.id, user.selected]"
    class="user-row"
  >
    <input type="checkbox" :checked="user.selected" />
    <span>{{ user.name }}</span>
    <!-- remark 变化不会重渲染此行：它不在依赖数组里 -->
    <span class="muted">{{ user.remark }}</span>
  </div>
</template>