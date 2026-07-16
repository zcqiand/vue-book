<script setup lang="ts">
/**
 * 侧边栏（Phase 1.4 对齐 React Layout.tsx）：
 * 分组：首页 / 身份管理 / 认证授权 / 安全控制 / 平台运营 / 平台管理
 * 按 hasPermission 过滤，平台链接跳 /platform/*，租户链接自动加 tenantId 前缀。
 */
import { computed, inject, ref as makeRef, type Ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { usePermission } from '@/composables/usePermission'
import { platformNavItems } from '@/router/nav'

const { hasPermission } = usePermission()
const route = useRoute()
const tenantId = inject<Ref<string>>('tenantId', makeRef(''))

interface NavItem {
  label: string
  to: string
  permission?: string
  platform?: boolean
}

interface NavGroup {
  label: string
  items: NavItem[]
}

const tenantNav: NavGroup[] = [
  {
    label: '首页',
    items: [{ label: '工作台', to: 'dashboard', permission: 'dashboard:read' }],
  },
  {
    label: '身份管理',
    items: [
      { label: '组织管理', to: 'org', permission: 'org:read' },
      { label: '岗位管理', to: 'positions', permission: 'position:read' },
      { label: '角色管理', to: 'roles', permission: 'role:read' },
      { label: '权限组别', to: 'permission-groups', permission: 'permission-group:read' },
      { label: '菜单权限', to: 'menu-permissions', permission: 'menu:read' },
      { label: '用户组别', to: 'user-groups', permission: 'user-group:read' },
      { label: '用户管理', to: 'users', permission: 'user:read' },
    ],
  },
  // ……（认证授权 / 安全控制 / 平台运营分组结构同上，省略）……
]

const platformNav: NavGroup[] = [
  {
    label: '平台管理',
    items: platformNavItems.map((it) => ({ ...it, platform: true })),
  },
]

// 按权限过滤：无 permission 字段或 hasPermission 通过即显示
const visibleTenantGroups = computed(() =>
  tenantNav
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => !it.permission || hasPermission(it.permission)),
    }))
    .filter((g) => g.items.length > 0)
)

const visiblePlatformGroups = computed(() =>
  platformNav
    .map((g) => ({
      ...g,
      items: g.items.filter((it) => !it.permission || hasPermission(it.permission)),
    }))
    .filter((g) => g.items.length > 0)
)

/** 构建完整路径：平台路由直接用 to，租户路由拼接 /:tenantId/ */
function buildPath(to: string): string {
  return to.startsWith('/') ? to : `/${tenantId.value}/${to}`
}

function isActive(to: string): boolean {
  if (to.startsWith('/')) return route.path.startsWith(to)
  return route.path.includes(`/${to}`)
}
</script>