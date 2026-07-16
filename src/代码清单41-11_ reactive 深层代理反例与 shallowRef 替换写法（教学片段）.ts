import { reactive, shallowRef } from 'vue'
import type { AuditLog } from '@/types/user'

export function createAuditLogStateExamples(seedLogs: AuditLog[]) {
  // 反例：reactive 会深层代理数组中每个对象的所有字段
  const notRecommended = reactive({ logs: seedLogs })

  // 推荐：shallowRef 只追踪 .value 整体替换
  const recommended = shallowRef<AuditLog[]>(seedLogs)

  function replaceLogs(nextLogs: AuditLog[]): void {
    recommended.value = nextLogs
  }

  // 修改单条：必须整体替换数组，shallowRef 才会触发更新
  function updateFirstActor(actor: string): void {
    if (!recommended.value[0]) return
    const [first, ...rest] = recommended.value
    recommended.value = [{ ...first, operator: actor }, ...rest]
  }

  return { notRecommended, recommended, replaceLogs, updateFirstActor }
}