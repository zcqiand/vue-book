const props = withDefaults(
  defineProps<{
    stage: string                                   // 'receiving' / 'review' / 'archived' …
    stageLabel: string                              // '接样管理' / '报告审核' …
    submitLabel?: string                            // '提交' / '审核通过' / '发放' …
    subtitle?: string                               // 标题下说明（对齐 React FlowStagePage）
    extraColumns?: ExtraColumn[]                    // 表格里追加的列：{ key, label, value(row) }
    rowActions?: (row: SampleReceipt) => RowAction[] | RowAction
    canSubmit?: boolean                             // 默认 true；归档页传 false
    canReturn?: boolean | null                      // null=按阶段顺序自动推断；true/false=显式
    nextStageLabel?: string                         // 覆盖「提交后进入」的中文标签
  }>(),
  { canSubmit: true, canReturn: null },
)

const stageIdx = computed(() => FLOW_STAGE_ORDER.indexOf(props.stage as FlowStage))
const nextStage = computed(() => FLOW_STAGE_ORDER[stageIdx.value + 1])
const prevStage = computed(() => FLOW_STAGE_ORDER[stageIdx.value - 1])
const allowSubmit = computed(() => props.canSubmit && nextStage.value !== undefined)
const allowReturn = computed(() => {
  if (props.canReturn === null) return prevStage.value !== undefined
  return Boolean(props.canReturn)
})