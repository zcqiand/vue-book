<script setup lang="ts">
import { ref } from 'vue'
import UserList from './UserList.vue'
import UserDetail from './UserDetail.vue'

const currentTab = ref<'list' | 'detail'>('list')

const componentMap = {
  list: UserList,
  detail: UserDetail,
} as const
</script>

<template>
  <div class="user-tabs">
    <div class="tab-nav">
      <button @click="currentTab = 'list'">用户列表</button>
      <button @click="currentTab = 'detail'">用户详情</button>
    </div>

    <div class="tab-content">
      <!-- KeepAlive 缓存切换的组件实例 -->
      <KeepAlive :include="['UserList', 'UserDetail']">
        <component :is="componentMap[currentTab]" />
      </KeepAlive>
    </div>
  </div>
</template>