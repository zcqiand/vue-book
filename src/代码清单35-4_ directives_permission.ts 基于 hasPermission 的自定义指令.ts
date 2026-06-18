import type { Directive } from 'vue'
import { useAuthStore } from '@/stores/auth'

// ❶ value 类型支持单个权限字符串或字符串数组
// 数组语义是 OR（任一满足即放行），如 v-permission="['report:delete', 'admin']"
type PermissionValue = string | string[]

// ❷ 用 Directive<HTMLElement, PermissionValue> 标注，模板里 v-permission 自动获得类型提示
export const vPermission: Directive<HTMLElement, PermissionValue> = {
  mounted(el, binding) {
    // 在指令内取 store：指令是全局注册的，不在 setup 上下文里，无法用 useAuth Composable
    const authStore = useAuthStore()

    const value = binding.value
    // 防御性兜底：value 未传或为空字符串时按放行处理，否则误写 v-permission="" 会让整页元素消失
    const required: string[] = Array.isArray(value) ? value : [value]
    if (required.length === 0) {
      return
    }

    // 任一权限满足即放行（OR 语义）
    const allowed = required.some((perm) => authStore.hasPermission(perm))
    if (!allowed) {
      // ❸ 用 parentNode.removeChild 而非 v-if 是因为指令是声明式的、可在任意元素（含第三方组件根元素）上用
      // 不污染组件逻辑：组件内部不知道这个按钮被指令移除了，组件树本身保持完整
      el.parentNode?.removeChild(el)
    }
  },
  unmounted() {}
}

// === 在 main.ts 注册（仅展示注册行，完整 main.ts 见第 5 章） ===
// import { createApp } from 'vue'
// import { vPermission } from '@/directives/permission'
// const app = createApp(App)
// app.directive('permission', vPermission)
// 模板里用：<button v-permission="'report:delete'">删除报告</button>