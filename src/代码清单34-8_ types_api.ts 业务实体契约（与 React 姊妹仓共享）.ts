// 业务实体类型定义（建筑工程实验室管理系统 v3）—— 与 React 姊妹仓共享 API 契约。
// Vue 仓与 React 仓字段名/类型完全一致，保证双栈对照时可逐字段比对。
// 领域模型：
//   合同 Contract → 接样单 SampleReceipt（含报告类别 categoryCode、合并报告字段、流程状态）
//     → 样品 Sample（归属接样单，型号/规格/等级/牌号 + 按报告类别的扩展属性 ext）
//       → 单项检测记录 TestItem（归属样品，自动评定 + 手工修正）

/** 权限码：资源:操作（如 project:read、user:delete） */
export type Permission = string

/** 角色 */
export interface Role {
  id: string
  name: string
  permissions: Permission[]
}

/** 用户 */
export interface User {
  id: string
  username: string
  displayName: string
  role: Role
  /** 用户最终权限集合（角色权限 + 个人授权的并集） */
  permissions: Permission[]
}

/** 分页响应 */
export interface Page<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

// =============================================================================
// 流程管线（接样表与报告表合并为一张表，单一流程线）
// =============================================================================

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
  'receiving',
  'task_assignment',
  'data_entry',
  'review',
  'approval',
  'issuance',
  'archived',
  'completed',
]

/** 流程阶段中文名 */
export const FLOW_STAGE_LABELS: Record<FlowStage, string> = {
  receiving: '接样中',
  task_assignment: '分配中',
  data_entry: '录入中',
  review: '审核中',
  approval: '批准中',
  issuance: '发放中',
  archived: '归档中',
  completed: '已归档',
}

/** 接样单（接样表与报告表合并为一张表） */
export interface SampleReceipt {
  id: string
  contractId: string
  commissionCode: string
  commissionDate: string
  receiptCode: string
  categoryCode: string
  projectName?: string
  clientUnit?: string
  witnessUnit?: string
  witness?: string
  receivedBy: string
  flowStatus: FlowStage
  flowHistory: FlowHistoryEntry[]
  lastSubmittedBy: string | null
  assigneeId?: string
  assigneeName?: string
  plannedTestDate?: string
  reportCode?: string
  reportDate?: string
  conclusion?: string
  result?: 'pass' | 'fail' | ''
  issuedAt?: string | null
  createdAt: string
  updatedAt: string
}

/** 流程历史条目 */
export interface FlowHistoryEntry {
  action: FlowAction
  from: FlowStage
  to: FlowStage
  operator: string
  at: string
  reason?: string
}

/** 流程动作：submit=提交（前进）、return=退回（后退）、withdraw=撤回（提交人主动收回） */
export type FlowAction = 'submit' | 'return' | 'withdraw'

// =============================================================================
// 报告（v1 = reportStore + ReportList，v2 = reportStoreV2 + ReportWorkflowList）
// =============================================================================

/** v1 报告实体 */
export interface Report {
  id: string
  sampleId: string
  title: string
  status: ReportStatus
  conclusion?: string
  issuedAt?: string | null
  createdAt: string
  updatedAt: string
}

/** v1 报告状态：草稿 / 审核中 / 已签发 */
export type ReportStatus = 'draft' | 'reviewing' | 'issued'

/** v2 报告实体（对齐 React ReportRecord） */
export interface ReportRecord {
  id: string
  reportCode: string
  contractId: string
  receiptId: string
  materialType: string
  sampleIds: string[]
  reportDate?: string
  conclusion?: string
  result?: 'pass' | 'fail'
  status: string
  remark?: string
  issuedAt?: string | null
  createdAt: string
  updatedAt: string
}