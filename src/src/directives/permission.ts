// 代码清单35-4: 按钮级权限指令 v-permission
// src/directives/permission.ts
import type { Directive } from 'vue'
import { useUserStore } from '@/stores/user'

export const vPermission: Directive = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const requiredRole = binding.value as string
    if (requiredRole && userStore.userInfo?.role !== requiredRole) {
      el.parentNode?.removeChild(el)
    }
  },
}