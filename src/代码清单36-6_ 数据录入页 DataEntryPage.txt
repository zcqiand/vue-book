<script setup lang="ts">
import { ref } from 'vue'
import FlowStagePage from '@/components/FlowStagePage.vue'
import DataEntryModal from '@/components/data-entry/DataEntryModal.vue'
import ReportPreviewModal from '@/components/ReportPreviewModal.vue'
import { useCategories, categoryName } from '@/composables/useCategories'
import type { SampleReceipt } from '@/types/api'

const { categories, load } = useCategories()
load()

const entryTarget = ref<SampleReceipt | null>(null)
const previewTarget = ref<SampleReceipt | null>(null)

function rowActions(r: SampleReceipt) {
  return [
    { label: '录入结果', testid: `btn-entry-${r.id}`,
      dataFn: 'M03.F03.I03', on: () => (entryTarget.value = r) },
    { label: '生成报告', testid: `btn-preview-${r.id}`,
      dataFn: 'M03.F03.I05', on: () => (previewTarget.value = r) },
  ]
}
</script>

<template>
  <div data-fn="M03.F03.I01">
    <FlowStagePage
      stage="data_entry"
      stage-label="数据录入"
      submit-label="提交审核"
      subtitle="录入各样品的检测结果；系统按报告类别与样品的牌号/型号/等级/规格自动匹配技术要求并评定"
      :extra-columns="[
        { key: 'categoryName', label: '报告类别', value: (r) => categoryName(categories, r.categoryCode) },
        { key: 'assigneeName', label: '检测人员', value: (r) => r.assigneeName ?? '—' },
        { key: 'overallResult', label: '整体结论',
          value: (r) => r.result === 'pass' ? '合格' : r.result === 'fail' ? '不合格' : '未录入' },
      ]"
      :row-actions="rowActions"
    />

    <DataEntryModal
      v-if="entryTarget"
      :receipt="entryTarget"
      @close="entryTarget = null"
      @preview="(previewTarget = entryTarget), (entryTarget = null)"
    />

    <ReportPreviewModal v-if="previewTarget" :receipt="previewTarget" @close="previewTarget = null" />
  </div>
</template>