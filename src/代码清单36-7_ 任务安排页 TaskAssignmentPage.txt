<script setup lang="ts">
import { ref } from 'vue'
import { useReceiptStore } from '@/stores/receipt'
import FlowStagePage from '@/components/FlowStagePage.vue'
import type { SampleReceipt } from '@/types/api'

const receipt = useReceiptStore()

const assignTarget = ref<SampleReceipt | null>(null)
const assignName = ref('')
const assignDate = ref('')
const assigning = ref(false)

function openAssign(r: SampleReceipt) {
  assignTarget.value = r
  assignName.value = r.assigneeName ?? ''
  assignDate.value = r.plannedTestDate ? r.plannedTestDate.split('T')[0] : ''
  assigning.value = false
}

async function handleAssign() {
  if (!assignTarget.value || !assignName.value.trim()) return
  assigning.value = true
  try {
    const name = assignName.value.trim()
    await receipt.updateReceipt(assignTarget.value.id, {
      assigneeName: name,
      assigneeId: `u-${name}`,
      plannedTestDate: assignDate.value || undefined,
    })
    assignTarget.value = null
  } finally { assigning.value = false }
}

function rowActions(r: SampleReceipt) {
  return [{ label: '安排', testid: `btn-assign-${r.id}`,
    dataFn: 'M03.F02.I02', on: openAssign }]
}
</script>

<template>
  <div data-fn="M03.F02.I01">
    <FlowStagePage
      stage="task_assignment"
      stage-label="任务安排"
      submit-label="提交"
      subtitle="为接样单指派检测人员和计划检测日期；安排后请提交进入数据录入环节"
      :row-actions="rowActions"
    />
  </div>

  <Teleport to="body">
    <div v-if="assignTarget" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-lg shadow-xl w-[360px] p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-semibold">任务安排 — {{ assignTarget.commissionCode }}</h3>
          <button class="text-gray-400 hover:text-gray-600 text-xl leading-none"
            @click="assignTarget = null">×</button>
        </div>
        <div class="space-y-3 text-sm">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">检测人员 *</label>
            <input v-model="assignName" class="w-full border rounded px-3 py-2"
              placeholder="输入检测人员姓名" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">计划检测日期</label>
            <input v-model="assignDate" type="date" class="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <button class="px-4 py-2 text-sm border rounded hover:bg-gray-100"
            @click="assignTarget = null">取消</button>
          <button class="px-4 py-2 text-sm rounded text-white bg-blue-600 hover:bg-blue-700
            disabled:opacity-50" :disabled="!assignName.trim() || assigning"
            @click="handleAssign">
            {{ assigning ? '安排中…' : '确认安排' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>