<script setup lang="ts">
import { ref } from 'vue'
import TableList from './TableList.vue'

const columns = ref([
  { key: 'name', label: '姓名' },
  { key: 'role', label: '职位' },
  { key: 'status', label: '状态' },
])

const users = ref([
  { id: 1, name: '李明', role: '前端工程师', status: 'active' },
  { id: 2, name: '王芳', role: '产品经理', status: 'inactive' },
])

const statusMap: Record<string, { label: string; cls: string }> = {
  active: { label: '在职', cls: 'status-active' },
  inactive: { label: '离职', cls: 'status-inactive' },
}
</script>

<template>
  <TableList :columns="columns" :items="users">
    <template #name="{ row }">
      <strong>{{ row.name }}</strong>
    </template>

    <template #status="{ row }">
      <span :class="['badge', statusMap[row.status]?.cls ?? 'badge-default']">
        {{ statusMap[row.status]?.label ?? row.status }}
      </span>
    </template>
  </TableList>
</template>