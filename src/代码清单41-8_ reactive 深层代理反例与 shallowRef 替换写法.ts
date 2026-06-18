import { reactive, shallowRef } from 'vue'
import type { AuditLog } from '@/stores/user'

export function createAuditLogStateExamples(seedLogs: AuditLog[]) {
  const notRecommended = reactive({
    // 不推荐：上万条日志通常只展示和替换，不需要每个内部字段都被深层代理追踪。
    logs: seedLogs
  })

  const recommended = shallowRef<AuditLog[]>(seedLogs)

  function replaceLogs(nextLogs: AuditLog[]): void {
    // 推荐：shallowRef 的更新边界是 .value，整体替换能让视图更新，也能减少深层代理成本。
    recommended.value = nextLogs
  }

  function updateFirstActor(actor: string): void {
    if (!recommended.value[0]) {
      return
    }
    const [first, ...rest] = recommended.value
    recommended.value = [{ ...first, actor }, ...rest]
  }

  return {
    notRecommended,
    recommended,
    replaceLogs,
    updateFirstActor
  }
}