// ch40 安全/认证配置 store：登录方式 / SSO / OAuth2 / Token / API Key / 登录安全 / 密码策略 / 风险控制 …
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient } from '../api/client'
import type {
  LoginMethod, SsoProvider, OAuth2Provider, TokenConfig, ApiKey,
  LoginMethodUpdateInput, SsoProviderUpdateInput, OAuth2ProviderUpdateInput,
  TokenConfigUpdateInput, ApiKeyCreateInput, ApiKeyUpdateInput,
  LoginSecurity, PasswordPolicy, LoginSecurityUpdateInput, PasswordPolicyUpdateInput,
} from '../types/security'

export const useSecurityStore = defineStore('security', () => {
  const loginMethods = ref<LoginMethod[]>([])
  const ssoProviders = ref<SsoProvider[]>([])
  const oauth2Providers = ref<OAuth2Provider[]>([])
  const tokenConfig = ref<TokenConfig | null>(null)
  const apiKeys = ref<ApiKey[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // —— 登录方式：列表 + 单条更新 ——
  async function fetchLoginMethods(): Promise<void> {
    loading.value = true
    try { const { data } = await apiClient.get<LoginMethod[]>('/login-methods'); loginMethods.value = data }
    catch (err) { error.value = extractErrorMessage(err, '登录方式加载失败') } finally { loading.value = false }
  }
  async function updateLoginMethod(id: string, patch: LoginMethodUpdateInput): Promise<LoginMethod | null> {
    try {
      const { data } = await apiClient.put<LoginMethod>(`/login-methods/${id}`, patch)
      const idx = loginMethods.value.findIndex((m) => m.id === id)
      if (idx !== -1) loginMethods.value[idx] = data
      return data
    } catch (err) { error.value = extractErrorMessage(err, '登录方式更新失败'); return null }
  }

  // —— API Key：完整 CRUD（fetch / create / update / remove）——
  async function fetchApiKeys(): Promise<void> {
    loading.value = true
    try { const { data } = await apiClient.get<ApiKey[]>('/api-keys'); apiKeys.value = data }
    catch (err) { error.value = extractErrorMessage(err, 'API Key 加载失败') } finally { loading.value = false }
  }
  async function createApiKey(input: ApiKeyCreateInput): Promise<ApiKey | null> {
    try {
      const { data } = await apiClient.post<ApiKey>('/api-keys', input)
      apiKeys.value = [...apiKeys.value, data]
      return data
    } catch (err) { error.value = extractErrorMessage(err, 'API Key 创建失败'); return null }
  }
  async function updateApiKey(id: string, patch: ApiKeyUpdateInput): Promise<ApiKey | null> {
    try {
      const { data } = await apiClient.put<ApiKey>(`/api-keys/${id}`, patch)
      const idx = apiKeys.value.findIndex((k) => k.id === id)
      if (idx !== -1) apiKeys.value[idx] = data
      return data
    } catch (err) { error.value = extractErrorMessage(err, 'API Key 更新失败'); return null }
  }
  async function removeApiKey(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/api-keys/${id}`)
      apiKeys.value = apiKeys.value.filter((k) => k.id !== id)
      return true
    } catch (err) { error.value = extractErrorMessage(err, 'API Key 删除失败'); return false }
  }

  // ……（SSO / OAuth2 / TokenConfig / LoginSecurity / PasswordPolicy 等 action 同构，略）

  function clearError(): void { error.value = null }
  return { loginMethods, ssoProviders, oauth2Providers, tokenConfig, apiKeys, loading, error,
    fetchLoginMethods, updateLoginMethod, fetchApiKeys, createApiKey, updateApiKey, removeApiKey,
    /* …其余 action… */ clearError }
})

function extractErrorMessage(err: unknown, fallback: string): string {
  const axiosErr = err as { response?: { data?: { message?: string } }; message?: string }
  if (axiosErr.response?.data?.message) return axiosErr.response.data.message
  if (axiosErr.message) return axiosErr.message
  return fallback
}