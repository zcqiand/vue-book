<script setup lang="ts">
// 组织管理页（对齐 React OrgTree.tsx + Orgs.tsx）：
// - 挂载拉组织树 → 用 OrgTreeNode 递归渲染
// - 节点支持展开/折叠/选中（选中后工具栏可增/改/删）
// - 新增/编辑走 OrgNodeFormModal，删除走 ConfirmModal
// - 操作调 org store，成功后刷新树
// 复用既有 OrgTreeNode.vue（不改其签名），操作按钮集中在页面工具栏。
import { ref, computed, watch, onMounted } from 'vue'
import { useOrgStore } from '@/stores/org'
import { storeToRefs } from 'pinia'
import OrgTreeNode from '@/components/OrgTreeNode.vue'
import OrgNodeFormModal from '@/components/OrgNodeFormModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import type { OrgNode } from '@/types/user'

const store = useOrgStore()
const { tree, loading, error } = storeToRefs(store)

// 展开集合：默认根 + 一级展开（对齐 React OrgTree 初始化逻辑）
const expandedSet = ref<Set<string>>(new Set(['org-root']))
const selectedNode = ref<OrgNode | null>(null)

// 弹窗状态
const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formNodeId = ref<string | undefined>(undefined)
const formInitialName = ref('')
const submitting = ref(false)

const deleteTarget = ref<OrgNode | null>(null)
const deleting = ref(false)

// 树加载完成后初始化展开集合（根 + 一级子节点）
watch(tree, (t) => {
  if (!t) return
  const initial = new Set<string>(['org-root'])
  t.children?.forEach((c) => initial.add(c.id))
  expandedSet.value = initial
}, { immediate: true })

const isSelected = computed(() => selectedNode.value !== null)
const canDelete = computed(() => selectedNode.value?.id !== 'org-root')

onMounted(() => {
  store.fetchOrgTree()
})

function handleToggle(node: OrgNode): void {
  const next = new Set(expandedSet.value)
  if (next.has(node.id)) next.delete(node.id)
  else next.add(node.id)
  expandedSet.value = next
}

function handleSelect(node: OrgNode): void {
  selectedNode.value = node
}

function openCreateChild(): void {
  const parent = selectedNode.value
  if (!parent) return
  formMode.value = 'create'
  formNodeId.value = parent.id
  formInitialName.value = ''
  formVisible.value = true
}

function openEdit(): void {
  const node = selectedNode.value
  if (!node) return
  formMode.value = 'edit'
  formNodeId.value = node.id
  formInitialName.value = node.name
  formVisible.value = true
}

async function handleFormSubmit(name: string, nodeId?: string): Promise<void> {
  submitting.value = true
  try {
    if (formMode.value === 'create' && nodeId) {
      await store.createOrgNode(name, nodeId)
    } else if (formMode.value === 'edit' && nodeId) {
      await store.updateOrgNode(nodeId, name)
    }
    // 操作失败时 store.error 会被设置；成功才关弹窗
    if (!store.error) {
      formVisible.value = false
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">组织管理</h2>
      <button
        data-testid="btn-create-root"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        @click="openCreateRoot"
      >
        新增根部门
      </button>
    </div>

    <!-- 选中节点工具栏 -->
    <div v-if="isSelected" data-testid="node-toolbar" class="bg-white rounded shadow p-3 flex items-center gap-3">
      <span class="text-sm text-gray-500">当前选中：</span>
      <span class="text-sm font-medium">{{ selectedNode?.name }}</span>
      <span class="flex-1" />
      <button data-testid="btn-add-child" @click="openCreateChild">+ 子部门</button>
      <button data-testid="btn-edit" @click="openEdit">编辑</button>
      <button v-if="canDelete" data-testid="btn-delete" @click="openDelete">删除</button>
    </div>

    <div class="bg-white rounded shadow overflow-hidden">
      <div v-if="tree" class="p-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">组织架构</h3>
        <ul>
          <OrgTreeNode
            :node="tree"
            :depth="0"
            @select="handleSelect"
            @toggle="handleToggle"
          />
        </ul>
      </div>
    </div>

    <OrgNodeFormModal
      :visible="formVisible"
      :mode="formMode"
      :node-id="formNodeId"
      :initial-name="formInitialName"
      :loading="submitting"
      @submit="handleFormSubmit"
      @cancel="formVisible = false"
    />
  </div>
</template>