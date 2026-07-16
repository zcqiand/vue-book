// 安全/认证配置类型（与 React 姊妹仓 src/types/security.ts 对齐）。
// 共享契约：字段名/类型/枚举与 React 仓一致。

// —— 登录方式 ——
export type LoginMethodType = 'password' | 'email_code' | 'sms_code' | 'totp' | 'sso' | 'oauth2'

export interface LoginMethod {
  id: string
  method: LoginMethodType
  name: string
  description?: string
  enabled: boolean
  sort: number
}

// —— Token 配置 ——
export interface TokenConfig {
  id: string
  accessTokenTtl: number
  refreshTokenTtl: number
  refreshTokenEnabled: boolean
  tokenRevocationEnabled: boolean
}

// —— API Key ——
export interface ApiKey {
  id: string
  name: string
  keyPrefix: string
  scopes: string[]
  expiresAt?: string
  enabled: boolean
  createdAt: string
  lastUsedAt?: string
}

export interface ApiKeyCreateInput {
  name: string
  scopes?: string[]
  expiresAt?: string
}
export type ApiKeyUpdateInput = Partial<ApiKeyCreateInput & { enabled: boolean }>

// —— 登录安全（ch41）——
export interface LoginSecurity {
  id: string
  ipWhitelist: string[]
  ipBlacklist: string[]
  regionRestrictionEnabled: boolean
  allowedRegions: string[]
  failedAttemptLockEnabled: boolean
  lockThreshold: number
  lockDuration: number
}

// —— 密码策略（ch41）——
export interface PasswordPolicy {
  id: string
  minLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireDigit: boolean
  requireSpecial: boolean
  expireDays: number
  historyCount: number
  enabled: boolean
}
// ……（OAuth2Provider / SsoProvider / RiskControl / NotificationConfig / OpenPlatformConfig 同构，略）