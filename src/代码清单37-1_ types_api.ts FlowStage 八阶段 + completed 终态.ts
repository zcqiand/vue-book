/** 流程阶段：委托接样 → 任务安排 → 数据录入 → 报告审核 → 报告批准 → 报告发放 → 报告归档 → 流程完成 */
export type FlowStage =
  | 'receiving'
  | 'task_assignment'
  | 'data_entry'
  | 'review'
  | 'approval'
  | 'issuance'
  | 'archived'
  | 'completed'

/** 流程阶段顺序（前进 = 提交，后退 = 退回/撤回） */
export const FLOW_STAGE_ORDER: FlowStage[] = [
  'receiving', 'task_assignment', 'data_entry', 'review',
  'approval', 'issuance', 'archived', 'completed',
]

/** 流程阶段中文名 */
export const FLOW_STAGE_LABELS: Record<FlowStage, string> = {
  receiving: '接样中', task_assignment: '分配中', data_entry: '录入中',
  review: '审核中', approval: '批准中', issuance: '发放中',
  archived: '归档中', completed: '已归档',
}