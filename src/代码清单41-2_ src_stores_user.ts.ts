import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type UserStatus = 'enabled' | 'disabled'
export type AuditAction = 'create' | 'update' | 'delete' | 'assignRoles' | 'toggleStatus'
export interface OrgNode { id: string; name: string; children: OrgNode[] }
export interface Role { id: string; name: string; permissions: string[] }
export interface User { id: string; tenantId: string; orgId: string; username: string; displayName: string; email: string; roleIds: string[]; status: UserStatus; createdAt: string; updatedAt: string }
export type UserInput = Omit<User, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>
export type AuditSnapshot = Partial<User>
export interface PageResult<T> { items: T[]; total: number }
export interface UserQuery { keyword?: string; orgId?: string; status?: UserStatus | ''; page: number; pageSize: number }
export interface AuditQuery { page: number; pageSize: number }
export interface AuditLog { id: string; tenantId: string; actor: string; action: AuditAction; targetId: string; targetName: string; before: AuditSnapshot | null; after: AuditSnapshot | null; createdAt: string }

const tenantId = 'tenant-a'
const actor = 'admin@tenant-a.local'
const now = new Date().toISOString()
const orgSeed: OrgNode[] = [{ id: 'org-root', name: '示例科技', children: [{ id: 'org-rd', name: '研发中心', children: [{ id: 'org-frontend', name: '前端组', children: [] }, { id: 'org-backend', name: '后端组', children: [] }] }, { id: 'org-ops', name: '运营中心', children: [{ id: 'org-cs', name: '客户成功组', children: [] }] }] }]
const roleSeed: Role[] = [{ id: 'role-admin', name: '租户管理员', permissions: ['user:read', 'user:create', 'user:update', 'user:delete', 'audit:read'] }, { id: 'role-viewer', name: '只读成员', permissions: ['user:read'] }]
const userSeed: User[] = [{ id: 'user-001', tenantId, orgId: 'org-frontend', username: 'lin', displayName: '林一', email: 'lin@example.com', roleIds: ['role-admin'], status: 'enabled', createdAt: now, updatedAt: now }]

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T }
function wait<T>(value: T): Promise<T> { return new Promise((resolve) => window.setTimeout(() => resolve(clone(value)), 120)) }
function makeId(prefix: string): string { return `${prefix}-${crypto.randomUUID().slice(0, 8)}` }
function normalizePage(query: AuditQuery): AuditQuery { return { page: Math.max(1, query.page), pageSize: Math.max(1, query.pageSize) } }

export const useUserStore = defineStore('user', () => {
  const orgTree = ref<OrgNode[]>(clone(orgSeed))
  const roles = ref<Role[]>(clone(roleSeed))
  const users = ref<User[]>(clone(userSeed))
  const auditLogs = ref<AuditLog[]>([])
  const roleNameMap = computed(() => new Map(roles.value.map((role) => [role.id, role.name])))

  function writeAudit(action: AuditAction, before: User | null, after: User | null): void {
    const target = after ?? before
    if (!target) throw new Error('缺少审计目标')
    auditLogs.value.unshift({ id: makeId('audit'), tenantId, actor, action, targetId: target.id, targetName: target.displayName, before: before ? clone(before) : null, after: after ? clone(after) : null, createdAt: new Date().toISOString() })
  }

  async function listUsers(query: UserQuery): Promise<PageResult<User>> {
    const keyword = query.keyword?.trim().toLowerCase() ?? ''
    const filtered = users.value.filter((user) => {
      const byOrg = query.orgId ? user.orgId === query.orgId : true
      const byStatus = query.status ? user.status === query.status : true
      const byKeyword = keyword ? [user.username, user.displayName, user.email].some((field) => field.toLowerCase().includes(keyword)) : true
      return user.tenantId === tenantId && byOrg && byStatus && byKeyword
    })
    const start = (query.page - 1) * query.pageSize
    return wait({ items: filtered.slice(start, start + query.pageSize), total: filtered.length })
  }

  async function createUser(input: UserInput): Promise<User> {
    if (users.value.some((user) => user.username === input.username)) throw new Error(`用户名已存在：${input.username}`)
    const created: User = { id: makeId('user'), tenantId, ...input, createdAt: now, updatedAt: now }
    users.value = [created, ...users.value]
    writeAudit('create', null, created)
    return wait(created)
  }

  async function updateUser(id: string, input: UserInput, action: AuditAction = 'update'): Promise<User> {
    const before = users.value.find((user) => user.id === id)
    if (!before) throw new Error(`用户不存在：${id}`)
    const after: User = { ...before, ...input, updatedAt: new Date().toISOString() }
    users.value = users.value.map((user) => (user.id === id ? after : user))
    writeAudit(action, before, after)
    return wait(after)
  }

  async function deleteUser(id: string): Promise<void> {
    const before = users.value.find((user) => user.id === id)
    if (!before) throw new Error(`用户不存在：${id}`)
    users.value = users.value.filter((user) => user.id !== id)
    writeAudit('delete', before, null)
  }

  function assignRoles(id: string, roleIds: string[]): Promise<User> {
    const user = users.value.find((item) => item.id === id)
    if (!user) throw new Error(`用户不存在：${id}`)
    return updateUser(id, { ...user, roleIds }, 'assignRoles')
  }

  function toggleStatus(id: string): Promise<User> {
    const user = users.value.find((item) => item.id === id)
    if (!user) throw new Error(`用户不存在：${id}`)
    return updateUser(id, { ...user, status: user.status === 'enabled' ? 'disabled' : 'enabled' }, 'toggleStatus')
  }

  function fetchAuditLogs(query: AuditQuery): Promise<PageResult<AuditLog>> {
    const page = normalizePage(query)
    const filtered = auditLogs.value.filter((log) => log.tenantId === tenantId)
    const start = (page.page - 1) * page.pageSize
    return wait({ items: filtered.slice(start, start + page.pageSize), total: filtered.length })
  }

  return { orgTree, roles, users, auditLogs, roleNameMap, listUsers, createUser, updateUser, deleteUser, assignRoles, toggleStatus, fetchAuditLogs }
})