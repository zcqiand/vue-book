import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiClient } from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import type { FlowActionResult, SampleReceipt } from '@/types/api'
import { transitions, targetStatus, type WorkflowStatusValue } from '@/types/workflow'

/** workflow store（ch37）：流程状态机的前端模型。
 * 持有 currentReceipt + currentStatus，提供：
 *   - availableActions（computed）：当前状态允许的动作 × 当前角色权限 → 可点按钮清单
 *   - transition（action）：合法性校验 → 调 /receipts/flow → 成功更新本地状态；失败抛错
 *   - watch(currentStatus)：状态变为 '报告发放' 等关键阶段时触发副作用（由视图层订阅）
 */
export const useWorkflowStore = defineStore('workflow', () => {
  const currentReceipt = ref<SampleReceipt | null>(null)
  const currentStatus = computed<WorkflowStatusValue>(
    () => (currentReceipt.value?.flowStatus ?? 'receiving') as WorkflowStatusValue,
  )
  const loading = ref(false)
  const error = ref('')

  /** 当前用户角色可执行的动作：transitions 允许 ∩ 角色有权限 ∩（withdraw 额外校验提交人） */
  const availableActions = computed(() => {
    const auth = useAuthStore()
    const allowed = transitions[currentStatus.value]
    return allowed.filter((action) => {
      // withdraw 仅最近提交人可用（无 lastSubmittedBy 视为不可撤回）
      if (action === 'withdraw') {
        return currentReceipt.value?.lastSubmittedBy === auth.user?.username
      }
      // 其他动作要求角色有 report:write 权限
      return auth.hasPermission('report:write')
    })
  })

  /** 载入某接样单到流程上下文 */
  async function loadReceipt(id: string): Promise<void> {
    loading.value = true
    error.value = ''
    try {
      const { data } = await apiClient.get<SampleReceipt>(`/receipts/${id}`)
      currentReceipt.value = data
    } catch {
      error.value = '加载接样单失败'
      currentReceipt.value = null
    } finally {
      loading.value = false
    }
  }

  /** 执行状态转换：合法 → 调后端 → 成功更新；非法或失败 → 抛错 */
  async function transition(
    action: 'submit' | 'return' | 'withdraw',
    reason?: string,
  ): Promise<FlowActionResult> {
    const receipt = currentReceipt.value
    if (!receipt) throw new Error('未载入接样单')
    const auth = useAuthStore()
    if (!transitions[currentStatus.value].includes(action)) {
      throw new Error(`当前状态「${currentStatus.value}」不允许执行「${action}」`)
    }
    loading.value = true
    error.value = ''
    try {
      const { data } = await apiClient.post<{ results: FlowActionResult[] }>('/receipts/flow', {
        action,
        ids: [receipt.id],
        operator: auth.user?.username ?? 'anonymous',
        reason,
      })
      const result = data.results[0]
      if (!result) throw new Error('后端未返回操作结果')
      if (!result.ok) {
        error.value = result.message ?? '操作失败'
        throw new Error(error.value)
      }
      // 成功：本地状态更新（避免再发一次 GET）
      const next = targetStatus(currentStatus.value, action)
      if (next && currentReceipt.value) {
        currentReceipt.value = { ...currentReceipt.value, flowStatus: next as SampleReceipt['flowStatus'] }
      }
      return result
    } catch (e) {
      if (error.value === '') error.value = e instanceof Error ? e.message : '操作失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  function reset(): void {
    currentReceipt.value = null
    loading.value = false
    error.value = ''
  }

  return {
    currentReceipt,
    currentStatus,
    loading,
    error,
    availableActions,
    loadReceipt,
    transition,
    reset,
  }
})