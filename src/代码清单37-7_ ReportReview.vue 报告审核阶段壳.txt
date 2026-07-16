<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FlowStagePage from '@/components/FlowStagePage.vue'
import ReportPreviewModal from '@/components/ReportPreviewModal.vue'
import { useCategories, categoryName } from '@/composables/useCategories'
import type { SampleReceipt } from '@/types/api'

const { categories, load } = useCategories()
onMounted(() => load())

const previewTarget = ref<SampleReceipt | null>(null)
</script>

<template>
  <FlowStagePage
    stage="review"
    stage-label="报告审核"
    submit-label="审核通过"
    subtitle="审核通过后进入报告批准"
    :extra-columns="[
      { key: 'categoryName', label: '报告类别', value: (r) => categoryName(categories, r.categoryCode) },
      { key: 'conclusion', label: '结论', value: (r) => r.conclusion ?? '—' },
    ]"
    :row-actions="(r) => ({ label: '查看报告', testid: 'row-action-view-report', on: () => (previewTarget = r) })"
  />
  <ReportPreviewModal v-if="previewTarget" :receipt="previewTarget" @close="previewTarget = null" />
</template>