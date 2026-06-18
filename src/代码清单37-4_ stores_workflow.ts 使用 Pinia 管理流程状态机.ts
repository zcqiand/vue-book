import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { loadWorkflow as requestWorkflow, transitionWorkflow } from '@/api/workflow';
import { useAuthStore } from '@/stores/auth';
import {
  Status,
  WorkflowActionId,
  type WorkflowAction,
  getLegalActions,
} from '@/types/workflow';

class WorkflowTransitionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WorkflowTransitionError';
  }
}

export const useWorkflowStore = defineStore('workflow', () => {
  const authStore = useAuthStore();
  const recordId = ref<string>('');
  const currentStatus = ref<Status>(Status.Accepted);
  const loading = ref<boolean>(false);
  const error = ref<string>('');
  const updatedAt = ref<string>('');

  const availableActions = computed<WorkflowAction[]>(() => {
    return getLegalActions(currentStatus.value).filter((action) => {
      return action.allowedRoles.some((role) => authStore.hasRole(role));
    });
  });

  function ensureRecordId(targetRecordId: string): void {
    if (!targetRecordId.trim()) {
      throw new WorkflowTransitionError('检测记录 ID 不能为空');
    }
  }

  function ensureActionAllowed(actionId: WorkflowActionId): WorkflowAction {
    const legalAction = getLegalActions(currentStatus.value).find((action) => action.id === actionId);

    if (!legalAction) {
      throw new WorkflowTransitionError(
        `状态「${currentStatus.value}」不允许执行动作「${actionId}」`,
      );
    }

    const hasRole = legalAction.allowedRoles.some((role) => authStore.hasRole(role));

    if (!hasRole) {
      throw new WorkflowTransitionError(`当前账号没有执行「${legalAction.label}」的角色权限`);
    }

    return legalAction;
  }

  function normalizeErrorMessage(cause: unknown): string {
    if (cause instanceof Error) {
      return cause.message;
    }

    if (typeof cause === 'string') {
      return cause;
    }

    return '流程操作失败，请稍后重试';
  }

  async function loadWorkflow(targetRecordId: string): Promise<void> {
    ensureRecordId(targetRecordId);

    loading.value = true;
    error.value = '';

    try {
      const response = await requestWorkflow(targetRecordId);
      recordId.value = response.data.recordId;
      currentStatus.value = response.data.currentStatus;
      updatedAt.value = response.data.updatedAt;
    } catch (cause) {
      error.value = normalizeErrorMessage(cause);
      throw cause;
    } finally {
      loading.value = false;
    }
  }

  async function transition(targetRecordId: string, actionId: WorkflowActionId): Promise<Status> {
    ensureRecordId(targetRecordId);
    const action = ensureActionAllowed(actionId);
    const previousStatus = currentStatus.value;
    const previousUpdatedAt = updatedAt.value;

    loading.value = true;
    error.value = '';

    try {
      const response = await transitionWorkflow({
        recordId: targetRecordId,
        actionId,
        fromStatus: previousStatus,
      });

      if (response.data.currentStatus !== action.targetStatus) {
        throw new WorkflowTransitionError(
          `接口返回状态「${response.data.currentStatus}」与前端动作目标「${action.targetStatus}」不一致`,
        );
      }

      recordId.value = response.data.recordId;
      currentStatus.value = response.data.currentStatus;
      updatedAt.value = response.data.updatedAt;

      return currentStatus.value;
    } catch (cause) {
      currentStatus.value = previousStatus;
      updatedAt.value = previousUpdatedAt;
      error.value = normalizeErrorMessage(cause);
      throw cause;
    } finally {
      loading.value = false;
    }
  }

  return {
    recordId,
    currentStatus,
    loading,
    error,
    updatedAt,
    availableActions,
    loadWorkflow,
    transition,
  };
});