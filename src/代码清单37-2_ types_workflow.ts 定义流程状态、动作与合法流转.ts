export enum Status {
  Accepted = '受理',
  Inspecting = '检测中',
  ReportGenerated = '报告生成',
  Approved = '审核通过',
  Rejected = '驳回',
  Withdrawn = '撤回',
}

export enum WorkflowActionId {
  StartInspection = 'start_inspection',
  GenerateReport = 'generate_report',
  Approve = 'approve',
  Reject = 'reject',
  Withdraw = 'withdraw',
  ReopenInspection = 'reopen_inspection',
}

export type WorkflowRole = 'inspector' | 'reviewer' | 'manager';

export interface WorkflowAction {
  id: WorkflowActionId;
  label: string;
  targetStatus: Status;
  allowedRoles: WorkflowRole[];
  confirmMessage: string;
}

export const workflowActions: Record<WorkflowActionId, WorkflowAction> = {
  [WorkflowActionId.StartInspection]: {
    id: WorkflowActionId.StartInspection,
    label: '开始检测',
    targetStatus: Status.Inspecting,
    allowedRoles: ['inspector', 'manager'],
    confirmMessage: '确认开始检测这条记录吗？',
  },
  [WorkflowActionId.GenerateReport]: {
    id: WorkflowActionId.GenerateReport,
    label: '生成报告',
    targetStatus: Status.ReportGenerated,
    allowedRoles: ['inspector', 'manager'],
    confirmMessage: '确认根据当前检测结果生成报告吗？',
  },
  [WorkflowActionId.Approve]: {
    id: WorkflowActionId.Approve,
    label: '审核通过',
    targetStatus: Status.Approved,
    allowedRoles: ['reviewer', 'manager'],
    confirmMessage: '确认审核通过这份报告吗？',
  },
  [WorkflowActionId.Reject]: {
    id: WorkflowActionId.Reject,
    label: '驳回',
    targetStatus: Status.Rejected,
    allowedRoles: ['reviewer', 'manager'],
    confirmMessage: '确认驳回当前流程吗？',
  },
  [WorkflowActionId.Withdraw]: {
    id: WorkflowActionId.Withdraw,
    label: '撤回',
    targetStatus: Status.Withdrawn,
    allowedRoles: ['manager'],
    confirmMessage: '确认撤回这条记录吗？撤回后不能继续流转。',
  },
  [WorkflowActionId.ReopenInspection]: {
    id: WorkflowActionId.ReopenInspection,
    label: '重新检测',
    targetStatus: Status.Inspecting,
    allowedRoles: ['inspector', 'manager'],
    confirmMessage: '确认把驳回记录重新转入检测中吗？',
  },
};

export const transitions: Record<Status, WorkflowAction[]> = {
  [Status.Accepted]: [
    workflowActions[WorkflowActionId.StartInspection],
    workflowActions[WorkflowActionId.Withdraw],
  ],
  [Status.Inspecting]: [
    workflowActions[WorkflowActionId.GenerateReport],
    workflowActions[WorkflowActionId.Reject],
    workflowActions[WorkflowActionId.Withdraw],
  ],
  [Status.ReportGenerated]: [
    workflowActions[WorkflowActionId.Approve],
    workflowActions[WorkflowActionId.Reject],
    workflowActions[WorkflowActionId.Withdraw],
  ],
  [Status.Approved]: [],
  [Status.Rejected]: [
    workflowActions[WorkflowActionId.ReopenInspection],
    workflowActions[WorkflowActionId.Withdraw],
  ],
  [Status.Withdrawn]: [],
};

export function getLegalActions(status: Status): WorkflowAction[] {
  return transitions[status];
}

export function resolveTargetStatus(currentStatus: Status, actionId: WorkflowActionId): Status {
  const action = transitions[currentStatus].find((item) => item.id === actionId);

  if (!action) {
    throw new Error(`状态「${currentStatus}」不允许执行动作「${actionId}」`);
  }

  return action.targetStatus;
}

export function isWorkflowRole(value: string): value is WorkflowRole {
  return value === 'inspector' || value === 'reviewer' || value === 'manager';
}

export function isStatus(value: string): value is Status {
  return Object.values(Status).includes(value as Status);
}