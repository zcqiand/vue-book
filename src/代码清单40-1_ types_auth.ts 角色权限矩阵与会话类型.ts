import type { Tenant } from '@/stores/tenant'

export const PERMISSIONS = [
  'dashboard:read',
  'user:read',
  'user:create',
  'user:update',
  'user:delete',
  'tenant:manage',
  'audit:read'
] as const

export type Permission = (typeof PERMISSIONS)[number]

export const ROLES = ['platform-admin', 'tenant-admin', 'auditor', 'member'] as const
export type Role = (typeof ROLES)[number]

export const ROLE_PERMISSION_MATRIX: Record<Role, readonly Permission[]> = {
  'platform-admin': [
    'dashboard:read',
    'user:read',
    'user:create',
    'user:update',
    'user:delete',
    'tenant:manage',
    'audit:read'
  ],
  'tenant-admin': ['dashboard:read', 'user:read', 'user:create', 'user:update', 'tenant:manage', 'audit:read'],
  auditor: ['dashboard:read', 'user:read', 'audit:read'],
  member: ['dashboard:read']
}

export interface TenantRoleBinding {
  tenantId: string
  roles: Role[]
  permissions: Permission[]
}

export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  expiresAt: string
  user: AuthUser
  tenantId: string
  roles: Role[]
  permissions: Permission[]
  availableTenants: Tenant[]
}

export type OAuthProvider = 'github' | 'google'

export interface SsoExchangeRequest {
  ticket?: string
  idpToken?: string
  returnTo?: string
  state: string
}

export interface OAuthExchangeRequest {
  provider: OAuthProvider
  code: string
  redirectUri: string
  state: string
}