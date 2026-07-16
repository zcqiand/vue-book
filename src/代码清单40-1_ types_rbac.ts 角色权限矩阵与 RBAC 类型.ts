// 镜像 React saas-identity-platform/src/features/rbac/types.ts 的 6 个类型（Permission / PermissionState /
// RoleCreateInput / RoleState / RoleActions / RoleStore）——这是 Vue/React 双栈仓的共享契约。
// 额外新增 RolePermissionMatrix / DEFAULT_ROLE_PERMISSION_MATRIX（Vue 侧，服务 ch40 角色-权限矩阵教学）。

/** 权限码：资源:操作 */
export interface Permission {
  resource: string
  action: string
  /** 可选：限定组织/范围 */
  scope?: string
}

/** 菜单权限项：某个菜单上授予的操作集合 */
export interface MenuPermission {
  menuId: string
  actions: ('view' | 'create' | 'update' | 'delete')[]
}

/** 角色 */
export interface Role {
  id: string
  name: string
  permissions: string[]
  /** 菜单权限列表（驱动「角色 × 菜单」矩阵页） */
  menuPermissions: MenuPermission[]
}

/** 角色创建输入 */
export interface RoleCreateInput {
  name: string
  permissions: string[]
  menuPermissions?: MenuPermission[]
}

/** 角色 store actions（驱动 roleStore 的 CRUD） */
export interface RoleActions {
  fetchRoles: () => Promise<void>
  createRole: (input: RoleCreateInput) => Promise<void>
  updateRole: (id: string, input: Partial<RoleCreateInput>) => Promise<void>
  deleteRole: (id: string) => Promise<void>
  clearError: () => void
}

/** 所有可选权限码 */
export const ALL_PERMISSIONS = [
  'user:read', 'user:create', 'user:update', 'user:delete',
  'org:read', 'org:write', 'audit:read',
] as const

/** 角色→权限默认矩阵（用于初始化/兜底）。Vue 侧教学常量。 */
export type RolePermissionMatrix = Record<string, string[]>
export const DEFAULT_ROLE_PERMISSION_MATRIX: RolePermissionMatrix = {
  admin: ['user:read', 'user:create', 'user:update', 'user:delete', 'org:read', 'org:write', 'audit:read'],
  owner: ['user:read', 'user:create', 'user:update', 'user:delete', 'org:read', 'org:write', 'audit:read'],
  manager: ['user:read', 'user:create', 'user:update', 'org:read', 'org:write'],
  auditor: ['user:read', 'org:read', 'audit:read'],
  operator: ['user:read', 'user:update', 'org:read'],
  member: ['user:read', 'org:read'],
  viewer: ['user:read', 'org:read'],
}