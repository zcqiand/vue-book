import { createTestingPinia } from '@pinia/testing'
import { defineStore, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

type WorkflowStatus = '受理' | '检测中' | '报告生成' | '审核通过' | '驳回' | '撤回'
type WorkflowAction =
  | 'start_inspection'
  | 'generate_report'
  | 'approve'
  | 'reject'
  | 'withdraw'
  | 'reopen_inspection'

const transitionTable: Record<WorkflowStatus, Partial<Record<WorkflowAction, WorkflowStatus>>> = {
  受理: { start_inspection: '检测中', withdraw: '撤回' },
  检测中: { generate_report: '报告生成', reject: '驳回', withdraw: '撤回' },
  报告生成: { approve: '审核通过', reject: '驳回', withdraw: '撤回' },
  审核通过: {},
  驳回: { reopen_inspection: '检测中', withdraw: '撤回' },
  撤回: {},
}

const useWorkflowStore = defineStore('workflow', {
  state: () => ({
    currentStatus: '受理' as WorkflowStatus,
  }),
  actions: {
    transition(action: WorkflowAction): WorkflowStatus {
      const nextStatus = transitionTable[this.currentStatus][action]

      if (!nextStatus) {
        throw new Error(`非法流程流转：当前状态「${this.currentStatus}」不能执行动作「${action}」`)
      }

      this.currentStatus = nextStatus
      return nextStatus
    },
  },
})

describe('workflow store', () => {
  beforeEach(() => {
    setActivePinia(
      createTestingPinia({
        createSpy: vi.fn,
        stubActions: false,
      }),
    )
  })

  it('允许从受理开始，依次进入检测中、报告生成、审核通过', () => {
    const workflowStore = useWorkflowStore()

    expect(workflowStore.currentStatus).toBe('受理')
    expect(workflowStore.transition('start_inspection')).toBe('检测中')
    expect(workflowStore.transition('generate_report')).toBe('报告生成')
    expect(workflowStore.transition('approve')).toBe('审核通过')
    expect(workflowStore.currentStatus).toBe('审核通过')
  })

  it('允许驳回后重新进入检测中', () => {
    const workflowStore = useWorkflowStore()

    workflowStore.transition('start_inspection')
    workflowStore.transition('generate_report')
    expect(workflowStore.transition('reject')).toBe('驳回')
    expect(workflowStore.transition('reopen_inspection')).toBe('检测中')
  })

  it('拦截非法流转，并保持原状态不变', () => {
    const workflowStore = useWorkflowStore()

    expect(() => workflowStore.transition('approve')).toThrow('非法流程流转')
    expect(workflowStore.currentStatus).toBe('受理')

    workflowStore.transition('withdraw')
    expect(workflowStore.currentStatus).toBe('撤回')
    expect(() => workflowStore.transition('start_inspection')).toThrow('非法流程流转')
    expect(workflowStore.currentStatus).toBe('撤回')
  })
})