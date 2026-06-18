import type { Directive, DirectiveBinding, EffectScope } from 'vue'
import { effectScope, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { Permission } from '@/types/auth'

type PermissionValue = Permission | Permission[]

type PermissionBinding = DirectiveBinding<PermissionValue> & {
  modifiers: {
    all?: boolean
  }
}

const scopeMap = new WeakMap<HTMLElement, EffectScope>()

function normalize(value: PermissionValue): Permission[] {
  return Array.isArray(value) ? value : [value]
}

function isAllowed(currentPermissions: Permission[], binding: PermissionBinding): boolean {
  const permissionSet = new Set(currentPermissions)
  const required = normalize(binding.value)

  return binding.modifiers.all
    ? required.every((permission) => permissionSet.has(permission))
    : required.some((permission) => permissionSet.has(permission))
}

function updateElementVisibility(
  el: HTMLElement,
  binding: PermissionBinding,
  currentPermissions: Permission[]
): void {
  const allowed = isAllowed(currentPermissions, binding)
  el.hidden = !allowed
  el.toggleAttribute('aria-hidden', !allowed)
}

export const permissionDirective: Directive<HTMLElement, PermissionValue> = {
  mounted(el: HTMLElement, binding: PermissionBinding) {
    const scope = effectScope()
    scopeMap.set(el, scope)

    scope.run(() => {
      const authStore = useAuthStore()

      watch(
        () => authStore.permissions.slice(),
        (currentPermissions) => {
          updateElementVisibility(el, binding, currentPermissions)
        },
        { immediate: true }
      )
    })
  },
  updated(el: HTMLElement, binding: PermissionBinding) {
    const authStore = useAuthStore()
    updateElementVisibility(el, binding, authStore.permissions)
  },
  unmounted(el: HTMLElement) {
    const scope = scopeMap.get(el)
    scope?.stop()
    scopeMap.delete(el)
  }
}