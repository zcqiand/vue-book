import { reactive, shallowRef } from 'vue'
import type { AuditLog } from '@/stores/user'

export function createAuditLogStateExamples(seedLogs: AuditLog[]) {
  const notRecommended = reactive({ logs: seedLogs })
  const recommended = shallowRef<AuditLog[]>(seedLogs)

  function replaceLogs(nextLogs: AuditLog[]): void {
    recommended.value = nextLogs
  }

  function updateFirstActor(actor: string): void {
    if (!recommended.value[0]) return
    const [first, ...rest] = recommended.value
    recommended.value = [{ ...first, actor }, ...rest]
  }

  return { notRecommended, recommended, replaceLogs, updateFirstActor }
}