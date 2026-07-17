<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useResource } from '@/composables/useResource'
import { useTable } from '@/composables/useTable'
import { useInspectionStore } from '@/stores/inspection'
import { apiClient } from '@/api/client'
import type { Contract, ContractCategory, ContractStatus } from '@/types/api'
import ProjectForm from '@/components/ProjectForm.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const { items, total, loading, error, load, create, update, remove } =
  useResource<Contract>('/contracts')
const { query, buildParams, reload, goToPage, search, sortBy } = useTable({ pageSize: 10 })

const inspectionStore = useInspectionStore()

// 合同类别字典：把 contractCategory(id) 解析为名称展示
const contractCategories = ref<ContractCategory[]>([])
const categoryName = (id?: string) =>
  (id && contractCategories.value.find((c) => c.id === id)?.name) || id || '—'

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / query.pageSize)))
const sortIndicator = (field: string) =>
  (query.sortField === field ? (query.sortOrder === 'asc' ? '↑' : '↓') : '')

const statusFilter = computed({
  get: () => (query as { status?: ContractStatus }).status,
  set: (v) => {
    (query as { status?: ContractStatus }).status = v
    query.page = 1
    reload()
  },
})

watch(() => query, async () => { await load(buildParams()) }, { deep: true })

onMounted(async () => {
  await inspectionStore.loadDictionaries()
  try {
    const { data } = await apiClient.get<{ items: ContractCategory[] }>('/contract-categories', {
      params: { page: 1, pageSize: 100 },
    })
    contractCategories.value = data.items ?? []
  } catch { contractCategories.value = [] }
  await load(buildParams())
})

const showForm = defineModel<boolean>('showForm', { default: false })
const editing = ref<Contract | null>(null)
const deleteTarget = ref<Contract | null>(null)
const deleting = ref(false)

function openEdit(c: Contract) { editing.value = c; showForm.value = true }

async function onSubmit(payload: Partial<Contract>) {
  if (editing.value) await update(editing.value.id, payload)
  else await create(payload)
  showForm.value = false
  editing.value = null
}

async function handleDelete() {
  if (!deleteTarget.value) return
  deleting.value = true
  try { await remove(deleteTarget.value.id); deleteTarget.value = null }
  finally { deleting.value = false }
}
</script>

<template>
  <div data-fn="M02.F01.I01">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">合同管理</h2>
      <button class="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        @click="showForm = true">+ 新建</button>
    </div>
    <div class="bg-white rounded-lg shadow p-4 mb-4 flex items-center gap-3">
      <input :value="query.keyword" type="text"
        placeholder="搜索合同编号 / 工程名称 / 委托单位"
        class="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
        @input="onSearch" />
      <select v-model="statusFilter" class="px-2 py-1.5 border border-gray-300 rounded text-sm">
        <option :value="undefined">全部状态</option>
        <option value="active">进行中</option>
        <option value="archived">已归档</option>
      </select>
    </div>
    <!-- ... 表格 + 分页 + 弹窗 -->
  </div>
</template>