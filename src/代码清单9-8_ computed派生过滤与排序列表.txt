<script setup lang="ts">
import { ref, computed } from 'vue'

type Role = 'admin' | 'editor' | 'viewer'

interface User {
  id: number
  name: string
  email: string
  department: string
  role: Role
}

const users = ref<User[]>([
  { id: 1, name: '张三', email: 'zhangsan@example.com', department: '技术部', role: 'admin' },
  { id: 2, name: '李四', email: 'lisi@example.com', department: '产品部', role: 'editor' },
  { id: 3, name: '王五', email: 'wangwu@example.com', department: '技术部', role: 'viewer' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com', department: '运营部', role: 'editor' },
])

const keyword = ref<string>('')
const filterDept = ref<string>('all')
const sortAsc = ref<boolean>(true)

// ❶ computed 链式派生：先过滤，再排序，返回全新的派生数组
const visibleUsers = computed<User[]>(() => {
  const kw = keyword.value.trim().toLowerCase()

  // filter 已生成全新数组，下面 sort 只 mutate 这个派生副本，不会改动源 users
  const filtered = users.value.filter(user => {
    const matchKeyword =
      kw === '' ||
      user.name.toLowerCase().includes(kw) ||
      user.email.toLowerCase().includes(kw)
    const matchDept = filterDept.value === 'all' || user.department === filterDept.value
    return matchKeyword && matchDept
  })

  return filtered.sort((a, b) => {
    const cmp = a.name.localeCompare(b.name, 'zh-Hans-CN')
    return sortAsc.value ? cmp : -cmp
  })
})

// ❷ 部门选项也由 computed 派生，避免硬编码
const departments = computed<string[]>(() => {
  const set = new Set(users.value.map(user => user.department))
  return ['all', ...Array.from(set)]
})

const isEmpty = computed<boolean>(() => visibleUsers.value.length === 0)
</script>

<template>
  <div class="user-manager">
    <h2>用户管理</h2>

    <div class="toolbar">
      <input v-model="keyword" type="text" placeholder="搜索姓名或邮箱" />

      <select v-model="filterDept">
        <option v-for="dept in departments" :key="dept" :value="dept">
          {{ dept === 'all' ? '全部部门' : dept }}
        </option>
      </select>

      <button @click="sortAsc = !sortAsc">
        按姓名{{ sortAsc ? '降序' : '升序' }}
      </button>
    </div>

    <p class="count">共 {{ visibleUsers.length }} 位用户</p>

    <!-- ❸ 空状态优先判断：过滤无结果时给明确反馈 -->
    <div v-if="isEmpty" class="empty">
      <p v-if="keyword !== '' || filterDept !== 'all'">
        没有找到匹配的用户，请调整搜索条件
      </p>
      <p v-else>暂无用户数据</p>
    </div>

    <!-- ❹ 列表渲染：:key 绑定 user.id，即使排序变了身份也不丢 -->
    <ul v-else>
      <li v-for="user in visibleUsers" :key="user.id" class="user-item">
        <span class="name">{{ user.name }}</span>
        <span class="email">{{ user.email }}</span>
        <span class="dept">{{ user.department }}</span>
        <span class="role">{{ user.role }}</span>
      </li>
    </ul>
  </div>
</template>