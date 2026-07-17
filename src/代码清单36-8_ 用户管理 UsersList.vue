<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useResource } from '@/composables/useResource'
import { apiClient } from '@/api/client'
import ConfirmModal from '@/components/ConfirmModal.vue'
import type { UserRecord, RoleRecord } from '@/types/api'

const { items, total, loading, error, load, create, update, remove } =
  useResource<UserRecord>('/users')
const roles = ref<RoleRecord[]>([])
onMounted(async () => {
  try {
    const { data } = await apiClient.get<{ items: RoleRecord[] }>('/roles',
      { params: { page: 1, pageSize: 100 } })
    roles.value = data.items ?? []
  } catch { roles.value = [] }
  load()
})

const roleName = (id: string) => roles.value.find((r) => r.id === id)?.name ?? id

// 角色过滤
const filterRole = ref('')
const filteredItems = computed(() =>
  items.value.filter((u) => !filterRole.value || u.roleId === filterRole.value))
</script>

<template>
  <section data-testid="users-list" data-fn="M01.F03.I01">
    <header class="flex items-center justify-between mb-3">
      <h3 class="text-base font-semibold">用户管理</h3>
      <div class="flex items-center gap-3">
        <select v-model="filterRole" class="px-2 py-1.5 border border-gray-300 rounded text-sm">
          <option value="">全部角色</option>
          <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.name }}</option>
        </select>
        <button class="px-3 py-1.5 text-sm rounded text-white bg-blue-600 hover:bg-blue-700"
          @click="openCreate">新增用户</button>
        <span class="text-xs text-gray-500">共 {{ total }} 个</span>
      </div>
    </header>
    <!-- 表格 + 弹窗 + 删除确认 -->
  </section>
</template>