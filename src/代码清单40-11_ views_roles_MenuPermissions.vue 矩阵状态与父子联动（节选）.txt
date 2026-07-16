<script setup lang="ts">
// 菜单权限矩阵（对齐 React rbac/MenuPermissions.tsx）。
// 选应用 + 选角色 → 渲染「菜单 × 操作」矩阵（查/建/改/删 + 全选），父菜单全选联动子菜单。
// 保存调 roleStore.updateRole(menuPermissions)，复用既有 /roles PUT 端点（无需新增 handler）。
import { ref, computed, onMounted, watch } from 'vue'
import { useRoleStore } from '@/stores/rbac'
import { useAppStore } from '@/stores/app'
import type { MenuPermission } from '@/types/rbac'
import type { MenuItem } from '@/types/app'

const roleStore = useRoleStore()
const appStore = useAppStore()

const ALL_ACTIONS = ['view', 'create', 'update', 'delete'] as const
const ACTION_LABELS: Record<string, string> = { view: '查', create: '建', update: '改', delete: '删' }

const selectedAppId = ref('')
const selectedRoleId = ref('')
const saving = ref(false)

// 本地权限态：roleId -> menuId -> actions[]
const permMap = ref<Record<string, Record<string, string[]>>>({})

const roles = computed(() => roleStore.list)
const currentAppMenus = computed<MenuItem[]>(() => appStore.menus)
const topMenus = computed(() => currentAppMenus.value.filter((m) => m.parentId === null))

onMounted(() => {
  roleStore.fetchRoles()
  appStore.fetchApps()
})

// 切换应用时拉取该应用菜单
watch(selectedAppId, (id) => {
  if (id) appStore.fetchMenus(id)
})

// 角色首次载入时初始化 permMap（保留已有值，避免覆盖本地编辑）
watch(roles, (list) => {
  if (list.length === 0) return
  const next = { ...permMap.value }
  for (const role of list) {
    if (!next[role.id]) {
      next[role.id] = {}
      for (const mp of role.menuPermissions ?? []) {
        next[role.id][mp.menuId] = [...mp.actions]
      }
    }
  }
  permMap.value = next
}, { immediate: true })

// 应用切换后：清掉当前角色中不属于本应用的旧 menuId，避免脏数据
watch([selectedAppId, selectedRoleId, currentAppMenus], () => {
  if (!selectedAppId.value || !selectedRoleId.value) return
  const rolePerms = { ...(permMap.value[selectedRoleId.value] ?? {}) }
  const appMenuIds = new Set(currentAppMenus.value.map((m) => m.id))
  for (const menuId of Object.keys(rolePerms)) {
    if (!appMenuIds.has(menuId)) delete rolePerms[menuId]
  }
  permMap.value = { ...permMap.value, [selectedRoleId.value]: rolePerms }
})

function getChildren(parentId: string): MenuItem[] {
  return currentAppMenus.value.filter((m) => m.parentId === parentId)
}

// 递归收集所有子孙 menuId（父子联动的关键）
function getAllDescendants(parentId: string): string[] {
  const children = getChildren(parentId)
  return children.flatMap((c) => [c.id, ...getAllDescendants(c.id)])
}

function isActionChecked(roleId: string, menuId: string, action: string): boolean {
  return permMap.value[roleId]?.[menuId]?.includes(action) ?? false
}

// 全选 = 四个操作都勾；indeterminate = 勾了一部分但没满四个
function isMenuAllChecked(roleId: string, menuId: string): boolean {
  return (permMap.value[roleId]?.[menuId]?.length ?? 0) === 4
}
function isMenuIndeterminate(roleId: string, menuId: string): boolean {
  const len = permMap.value[roleId]?.[menuId]?.length ?? 0
  return len > 0 && len < 4
}

function toggleAction(roleId: string, menuId: string, action: string) {
  const rolePerms = { ...(permMap.value[roleId] ?? {}), [menuId]: [...(permMap.value[roleId]?.[menuId] ?? [])] }
  const menuPerms = rolePerms[menuId]
  rolePerms[menuId] = menuPerms.includes(action)
    ? menuPerms.filter((a) => a !== action)
    : [...menuPerms, action]
  permMap.value = { ...permMap.value, [roleId]: rolePerms }
}

// 点父菜单「全选」：把父菜单和所有子孙菜单的四个操作一次性置为全勾或全空
function toggleMenuAll(roleId: string, menuId: string) {
  const current = permMap.value[roleId]?.[menuId] ?? []
  const willCheck = current.length !== 4
  const rolePerms = { ...(permMap.value[roleId] ?? {}) }
  const descendants = getAllDescendants(menuId)
  for (const mid of [menuId, ...descendants]) {
    rolePerms[mid] = willCheck ? [...ALL_ACTIONS] : []
  }
  permMap.value = { ...permMap.value, [roleId]: rolePerms }
}

async function handleSave() {
  if (!selectedRoleId.value) return
  saving.value = true
  try {
    const menuPermissions: MenuPermission[] = []
    for (const menu of currentAppMenus.value) {
      const actions = permMap.value[selectedRoleId.value]?.[menu.id]
      if (actions && actions.length > 0) {
        menuPermissions.push({ menuId: menu.id, actions: actions as MenuPermission['actions'] })
      }
    }
    await roleStore.updateRole(selectedRoleId.value, { menuPermissions })
    await roleStore.fetchRoles()
  } finally {
    saving.value = false
  }
}
</script>