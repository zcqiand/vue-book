// @entry M01.F04.I03 权限指令
import type { Directive, DirectiveBinding } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { Permission } from '@/types/api'

/** v-permission 指令（ch35）：按权限码控制元素挂载/卸载。
 *
 * 用法：
 *   <button v-permission="'report:issue'">发放</button>          // 单权限
 *   <button v-permission="['user:create', 'user:update']">保存</button> // 多权限任一命中即显示
 *
 * 实现：mounted/updated 时检查当前用户是否含任一权限；
 * 不命中则把元素从 DOM 中移除（el.parentNode.removeChild）。
 * 与 v-if 的差异：指令可在第三方组件 template 上就地使用，无需包裹 wrapper 组件。
 */
type BindingValue = Permission | Permission[]

function isPermitted(binding: DirectiveBinding<BindingValue>): boolean {
  const auth = useAuthStore()
  const codes = Array.isArray(binding.value) ? binding.value : [binding.value]
  return auth.hasAnyPermission(codes)
}

export const permissionDirective: Directive<HTMLElement, BindingValue> = {
  mounted(el, binding) {
    if (!isPermitted(binding)) {
      el.parentNode?.removeChild(el)
    }
  },
  updated(el, binding) {
    // 已被 mounted 移除的不重复处理（el.parentNode === null 表示已卸载）
    if (el.parentNode && !isPermitted(binding)) {
      el.parentNode.removeChild(el)
    }
  },
}