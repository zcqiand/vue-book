<script setup lang="ts">
import { ref } from 'vue'
import UserList from './views/UserList.vue'
import UserDetail from './views/UserDetail.vue'
import Dashboard from './views/Dashboard.vue'

const currentTab = ref<'list' | 'detail' | 'dashboard'>('list')

const componentMap = {
  list: UserList,
  detail: UserDetail,
  dashboard: Dashboard,
} as const
</script>

<template>
  <nav>
    <button @click="currentTab = 'list'">用户列表</button>
    <button @click="currentTab = 'detail'">用户详情</button>
    <button @click="currentTab = 'dashboard'">控制台</button>
  </nav>

  <!-- KeepAlive 缓存切换的组件，:max 限制最多缓存 3 个 -->
  <KeepAlive :max="3">
    <component :is="componentMap[currentTab]" />
  </KeepAlive>
</template>