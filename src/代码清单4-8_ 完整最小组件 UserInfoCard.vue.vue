<template>
  <div class="user-card" :class="{ vip: user.isVip }">
    <img class="avatar" :src="user.avatar" :alt="user.name" />

    <div class="info">
      <h3 class="name">
        {{ user.name }}
        <span v-if="user.isVip" class="badge">VIP</span>
      </h3>
      <p class="role">{{ user.role }}</p>

      <p class="visit">访问次数：{{ visitCount }}</p>
      <button @click="handleVisit">记录访问</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// defineProps 是编译器宏，声明组件接收的 props，无需 import
interface UserInfo {
  id: number
  name: string
  role: string
  avatar: string
  isVip: boolean
}

defineProps<{
  user: UserInfo
}>()

const visitCount = ref<number>(0)

function handleVisit(): void {
  visitCount.value++ // ref 在 script 内修改必须用 .value
  console.log('访问次数更新为：', visitCount.value)
}
</script>

<style scoped>
.user-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  max-width: 320px;
}
.user-card.vip {
  border-color: #f59e0b;
  background-color: #fffbeb;
}
.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
}
.name { margin: 0 0 4px; font-size: 16px; }
.badge {
  display: inline-block;
  margin-left: 6px;
  padding: 1px 6px;
  font-size: 12px;
  color: #fff;
  background-color: #f59e0b;
  border-radius: 4px;
}
.role { margin: 0; color: #6b7280; font-size: 13px; }
.visit { margin: 8px 0; font-size: 13px; }
button {
  padding: 4px 12px;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  background-color: #fff;
  color: #3b82f6;
  cursor: pointer;
}
button:hover {
  background-color: #3b82f6;
  color: #fff;
}
</style>