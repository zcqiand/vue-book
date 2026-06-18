import {
  Status,
  WorkflowActionId,
  isStatus,
  resolveTargetStatus,
} from '@/types/workflow';

export interface WorkflowDto {
  recordId: string;
  currentStatus: Status;
  updatedAt: string;
}

export interface LoadWorkflowResponse {
  data: WorkflowDto;
}

export interface TransitionWorkflowRequest {
  recordId: string;
  actionId: WorkflowActionId;
  fromStatus: Status;
}

export interface TransitionWorkflowResponse {
  data: WorkflowDto;
}

class WorkflowApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'WorkflowApiError';
  }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

function storageKey(recordId: string): string {
  return `workflow:${recordId}`;
}

function readMockWorkflow(recordId: string): WorkflowDto {
  const rawValue = window.localStorage.getItem(storageKey(recordId));

  if (!rawValue) {
    return {
      recordId,
      currentStatus: Status.Accepted,
      updatedAt: new Date().toISOString(),
    };
  }

  const parsedValue: unknown = JSON.parse(rawValue);

  if (!isWorkflowDto(parsedValue)) {
    window.localStorage.removeItem(storageKey(recordId));

    return {
      recordId,
      currentStatus: Status.Accepted,
      updatedAt: new Date().toISOString(),
    };
  }

  return parsedValue;
}

function writeMockWorkflow(dto: WorkflowDto): WorkflowDto {
  window.localStorage.setItem(storageKey(dto.recordId), JSON.stringify(dto));
  return dto;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isWorkflowDto(value: unknown): value is WorkflowDto {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.recordId === 'string' &&
    typeof value.currentStatus === 'string' &&
    isStatus(value.currentStatus) &&
    typeof value.updatedAt === 'string'
  );
}

async function parseJsonResponse<T>(response: Response): Promise<T> {
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = isRecord(body) && typeof body.message === 'string'
      ? body.message
      : `接口请求失败，HTTP 状态码：${response.status}`;
    throw new WorkflowApiError(message, response.status);
  }

  return body as T;
}

export async function loadWorkflow(recordId: string): Promise<LoadWorkflowResponse> {
  if (!apiBaseUrl) {
    return { data: readMockWorkflow(recordId) };
  }

  const response = await fetch(`${apiBaseUrl}/inspection-records/${recordId}/workflow`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  return parseJsonResponse<LoadWorkflowResponse>(response);
}

export async function transitionWorkflow(
  request: TransitionWorkflowRequest,
): Promise<TransitionWorkflowResponse> {
  if (!apiBaseUrl) {
    const currentDto = readMockWorkflow(request.recordId);

    if (currentDto.currentStatus !== request.fromStatus) {
      throw new WorkflowApiError(
        `流程状态已变化，当前为「${currentDto.currentStatus}」，请刷新后重试`,
        409,
      );
    }

    const nextStatus = resolveTargetStatus(request.fromStatus, request.actionId);
    const nextDto = writeMockWorkflow({
      recordId: request.recordId,
      currentStatus: nextStatus,
      updatedAt: new Date().toISOString(),
    });

    return { data: nextDto };
  }

  const response = await fetch(`${apiBaseUrl}/inspection-records/${request.recordId}/workflow/transitions`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      actionId: request.actionId,
      fromStatus: request.fromStatus,
    }),
  });

  return parseJsonResponse<TransitionWorkflowResponse>(response);
}