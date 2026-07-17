<script setup lang="ts">
import { ref } from 'vue'
import FlowStagePage from '@/components/FlowStagePage.vue'
import ReceiptFormModal from './ReceiptFormModal.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { useReceiptStore } from '@/stores/receipt'
import { useInspectionStore } from '@/stores/inspection'
import { useCategories, categoryName } from '@/composables/useCategories'
import type { SampleReceipt } from '@/types/api'

const receipt = useReceiptStore()
const inspection = useInspectionStore()
const { categories, load: loadCategories } = useCategories()
loadCategories()

const showForm = ref(false)
const editTarget = ref<Partial<SampleReceipt> | undefined>()
const deleteTarget = ref<SampleReceipt | null>(null)

function openCreate() { editTarget.value = undefined; showForm.value = true }
function openEdit(r: SampleReceipt) { editTarget.value = { ...r }; showForm.value = true }

async function onCreate(values: Partial<SampleReceipt>) {
  await receipt.createReceipt(values); showForm.value = false
}
async function onEdit(values: Partial<SampleReceipt>) {
  if (editTarget.value?.id) await receipt.updateReceipt(editTarget.value.id, values)
  showForm.value = false; editTarget.value = undefined
}
async function onDelete() {
  if (!deleteTarget.value) return
  await receipt.deleteReceipt(deleteTarget.value.id); deleteTarget.value = null
}

// 合同编号：按 contractId 反查合同 contractCode
function contractCodeOf(id: string): string {
  return inspection.contracts.find((c) => c.id === id)?.contractCode ?? id
}

// 行操作：receiving 显示 编辑 + 删除，其它阶段显示「已提交」
function rowActions(r: SampleReceipt) {
  if (r.flowStatus === 'receiving') {
    return [
      { label: '编辑', on: () => openEdit(r) },
      { label: '删除', on: () => (deleteTarget.value = r) },
    ]
  }
  return []
}
</script>

<template>
  <div data-fn="M03.F01.I01">
    <div class="mb-3">
      <button class="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
        @click="openCreate">新建接样单</button>
    </div>

    <FlowStagePage
      stage="receiving"
      stage-label="接样管理"
      submit-label="提交"
      :extra-columns="[
        { key: 'contractCode', label: '合同编号', value: (r) => contractCodeOf(r.contractId) },
        { key: 'categoryName', label: '报告类别', value: (r) => categoryName(categories, r.categoryCode) },
        { key: 'testCategory', label: '检测类别', value: (r) => r.testCategory ?? '—' },
      ]"
      :row-actions="rowActions"
    />

    <ReceiptFormModal
      :visible="showForm"
      :mode="editTarget?.id ? 'edit' : 'create'"
      :receipt="editTarget"
      @submit="editTarget?.id ? onEdit($event) : onCreate($event)"
      @cancel="showForm = false; editTarget = undefined"
    />

    <ConfirmModal
      :open="deleteTarget !== null"
      title="删除接样单"
      :message="`确定删除接样单「${deleteTarget?.commissionCode ?? ''}」？其下样品与检测记录将一并删除。`"
      confirm-text="确认删除"
      :loading="receipt.loading"
      @confirm="onDelete"
      @cancel="deleteTarget = null"
    />
  </div>
</template>