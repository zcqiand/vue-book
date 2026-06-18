import { computed, inject, provide, type ComputedRef, type InjectionKey } from 'vue'
import { useTenantStore, type TenantTheme } from '@/stores/tenant'

export interface TenantThemeContext {
  theme: ComputedRef<TenantTheme>
  cssVars: ComputedRef<Record<string, string>>
}

export const tenantThemeKey: InjectionKey<TenantThemeContext> = Symbol('tenant-theme')

const fallbackTheme: TenantTheme = {
  logoText: 'SaaS App',
  primaryColor: '#0f172a',
  surfaceColor: '#f8fafc'
}

export function provideTenantTheme(): TenantThemeContext {
  const tenantStore = useTenantStore()

  const theme = computed<TenantTheme>(() => tenantStore.currentTenant?.theme ?? fallbackTheme)
  const cssVars = computed<Record<string, string>>(() => ({
    '--tenant-primary': theme.value.primaryColor,
    '--tenant-surface': theme.value.surfaceColor
  }))

  const context: TenantThemeContext = { theme, cssVars }
  provide(tenantThemeKey, context)

  return context
}

export function useTenantTheme(): TenantThemeContext {
  const context = inject(tenantThemeKey)

  if (!context) {
    throw new Error('useTenantTheme must be used under a component that calls provideTenantTheme().')
  }

  return context
}