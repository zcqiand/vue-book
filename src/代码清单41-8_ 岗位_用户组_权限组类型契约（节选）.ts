// —— 岗位 ——
export interface Position {
  id: string
  name: string
  code: string
  description?: string
  sort: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

// —— 用户组 ——
export interface UserGroup {
  id: string
  name: string
  description?: string
  memberCount: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

// —— 权限组 ——
export interface PermissionGroup {
  id: string
  name: string
  code: string
  description?: string
  /** 包含的权限码列表 */
  permissions: string[]
  /** 关联菜单 ID 列表 */
  menuIds: string[]
  sort: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}