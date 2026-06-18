import type { Directive, DirectiveBinding, EffectScope } from 'vue'
import { effectScope, watch } from 'vue'
import { usePermission } from '@/composables/usePermission'
import { useAuthStore } from '@/stores/auth'
import type { Permission } from '@/types/auth'

type PermissionBindingValue = Permission | Permission[]

type PermissionBinding = DirectiveBinding<PermissionBindingValue> & {
  modifiers: {
    all?: boolean
  }
}

const scopeMap = new WeakMap<HTMLElement, EffectScope>()

function normalizePermissions(value: PermissionBindingValue): Permission[] {
  return Array.isArray(value) ? value : [value]
}

function removeElement(el: HTMLElement): void {
  if (el.parentNode !== null) {
    el.parentNode.removeChild(el)
  }
}

export const permissionDirective: Directive<HTMLElement, PermissionBindingValue> = {
  mounted(el: HTMLElement, binding: PermissionBinding) {
    const scope = effectScope()
    scopeMap.set(el, scope)

    scope.run(() => {
      const authStore = useAuthStore()
      const { hasAnyPermission, hasAllPermissions } = usePermission()

      watch(
        () => authStore.permissions.slice(),
        () => {
          const requiredPermissions = normalizePermissions(binding.value)
          const allowed = binding.modifiers.all
            ? hasAllPermissions(requiredPermissions)
            : hasAnyPermission(requiredPermissions)

          if (!allowed) {
            removeElement(el)
          }
        },
        { immediate: true }
      )
    })
  },
  unmounted(el: HTMLElement) {
    const scope = scopeMap.get(el)

    if (scope !== undefined) {
      scope.stop()
      scopeMap.delete(el)
    }
  }
}