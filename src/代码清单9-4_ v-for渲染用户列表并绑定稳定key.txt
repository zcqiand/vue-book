<script setup lang="ts">
import { ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
  department: string
}

// ❶ 列表数据用 ref<User[]>，每个用户带唯一 id
const users = ref<User[]>([
  { id: 101, name: '张三', email: 'zhangsan@example.com', department: '技术部' },
  { id: 102, name: '李四', email: 'lisi@example.com', department: '产品部' },
  { id: 103, name: '王五', email: 'wangwu@example.com', department: '技术部' },
])
</script>

<template>
  <div class="user-list">
    <h2>用户列表</h2>
    <ul>
      <!-- ❷ v-for 遍历 users，:key 绑定 user.id 这个稳定唯一字段 -->
      <li v-for="user in users" :key="user.id" class="user-card">
        <div class="user-name">{{ user.name }}</div>
        <div class="user-email">{{ user.email }}</div>
        <div class="user-dept">{{ user.department }}</div>
      </li>
    </ul>
  </div>
</template>