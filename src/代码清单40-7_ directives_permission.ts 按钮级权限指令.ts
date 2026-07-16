import type { Directive, DirectiveBinding } from 'vue'
import { useAuthStore } from '../stores/auth'

function evaluate(binding: DirectiveBinding): boolean {
  const value = binding.value
  const auth = useAuthStore()
  if (typeof value === 'string') return auth.permissions.includes(value)
  if (Array.isArray(value)) {
    // 数组 = anyOf
    return value.some((v: string) => auth.permissions.includes(v))
  }
  // 无值或非法值：放行（由模板自行处理）
  return true
}

/**
 * v-permission 用法：
 *   <button v-permission="'user:create'">新增</button>
 *   <div v-permission="['user:read', 'user:create']">...</div>
 * 无权限时元素被 removeChild 移除（mounted/updated 均判定）。
 */
export const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    if (!evaluate(binding)) el.parentNode?.removeChild(el)
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    if (!evaluate(binding)) el.parentNode?.removeChild(el)
  },
}

export default permissionDirective