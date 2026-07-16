<script setup lang="ts">
import { ref, type Ref } from 'vue'
import UserDetailAsync from './UserDetailAsync.vue'

const currentUserId: Ref<number> = ref(1)
</script>

<template>
  <Suspense>
    <template #default>
      <UserDetailAsync :user-id="currentUserId" />
    </template>
    <template #fallback>
      <div class="suspense-loading">正在加载用户档案...</div>
    </template>
  </Suspense>
</template>