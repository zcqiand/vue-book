// 代码清单28-4: 子组件 — UserBadge 消费 Pinia Store
// src/components/UserBadge.vue
<script setup lang="ts">
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
</script>

<template>
  <div class="user-badge">
    <template v-if="userStore.isLoggedIn">
      <img
        v-if="userStore.userInfo?.avatar"
        :src="userStore.userInfo.avatar"
        :alt="userStore.userInfo.name"
        class="avatar"
      />
      <span class="username">{{ userStore.userInfo?.name }}</span>
      <button class="logout-btn" @click="userStore.logout">退出</button>
    </template>
    <template v-else>
      <span class="guest">未登录</span>
    </template>
  </div>
</template>

<style scoped>
.user-badge {
  display: flex;
  align-items: center;
  gap: 8px;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.username {
  font-weight: 500;
}
.logout-btn {
  padding: 4px 8px;
  font-size: 12px;
}
.guest {
  color: #999;
}
</style>