<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import type { AppRouteMeta } from '@/router'

// 侧边栏菜单（对齐 React Layout.tsx）：
// 从 router 表派生菜单项，按当前用户权限过滤，并按 meta.group 分组渲染：
//   - 顶部独立「仪表盘」入口（dashboard 路由）
//   - 5 个可折叠分组：系统管理/资源管理/试验过程管理/基础数据/数据统计
interface MenuItem {
  name: string
  path: string
  title: string
  permissions: string[]
  group?: 'system' | 'resource' | 'process' | 'master' | 'stats'
  menuOrder: number
}

interface MenuSection {
  group: 'system' | 'resource' | 'process' | 'master' | 'stats'
  title: string
  items: MenuItem[]
}

const router = useRouter()
const { user, role, hasAnyPermission, logout } = useAuth()

/** 所有主布局子路由派生的菜单项（含分组与排序信息），按权限过滤。 */
const allMenuItems = computed<MenuItem[]>(() => {
  const rootRoute = router.getRoutes().find((r) => r.path === '/' && r.children.length > 0)
  const records = rootRoute
    ? rootRoute.children
    : router.getRoutes().filter(
        (r) =>
          r.name &&
          r.path !== '/login' &&
          r.path !== '/403' &&
          !r.path.includes(':pathMatch'),
      )
  return records
    .filter((child) => 'name' in child && child.name)
    .map((child) => {
      const meta = (child.meta ?? {}) as AppRouteMeta
      return {
        name: String(child.name ?? ''),
        path: child.path.startsWith('/') ? child.path : `/${child.path}`,
        title: meta.title ?? String(child.name),
        permissions: meta.permissions ?? [],
        group: meta.group,
        menuOrder: meta.menuOrder ?? 99,
      }
    })
    .filter((item) => hasAnyPermission(item.permissions))
})

/** 仪表盘单独入口（无分组） */
const dashboardItem = computed<MenuItem | undefined>(() =>
  allMenuItems.value.find((i) => i.name === 'dashboard'),
)

/** 系统管理：org-info / roles / users */
const systemItems = computed<MenuItem[]>(() =>
  allMenuItems.value
    .filter((i) => i.group === 'system')
    .sort((a, b) => a.menuOrder - b.menuOrder),
)

/** 资源管理：contracts */
const resourceItems = computed<MenuItem[]>(() =>
  allMenuItems.value
    .filter((i) => i.group === 'resource')
    .sort((a, b) => a.menuOrder - b.menuOrder),
)

/** 试验过程管理：接样/任务安排/数据录入/报告审核/报告批准/报告发放/报告归档 */
const processItems = computed<MenuItem[]>(() =>
  allMenuItems.value
    .filter((i) => i.group === 'process')
    .sort((a, b) => a.menuOrder - b.menuOrder),
)

/** 基础数据：类别/标准/参数/技术要求/型号/规格/等级/牌号/模板 */
const masterItems = computed<MenuItem[]>(() =>
  allMenuItems.value
    .filter((i) => i.group === 'master')
    .sort((a, b) => a.menuOrder - b.menuOrder),
)

/** 数据统计：汇总表 */
const statsItems = computed<MenuItem[]>(() =>
  allMenuItems.value
    .filter((i) => i.group === 'stats')
    .sort((a, b) => a.menuOrder - b.menuOrder),
)

const GROUP_META: Record<MenuSection['group'], string> = {
  system: '系统管理',
  resource: '资源管理',
  process: '试验过程管理',
  master: '基础数据',
  stats: '数据统计',
}

const sections = computed<MenuSection[]>(() => {
  const list: MenuSection[] = []
  // 顺序对齐 React Layout.tsx：RESOURCE → PROCESS → STATS → SYSTEM → MASTER
  // （系统管理排在数据统计之后、基础数据之前——与 React 版一致）
  if (resourceItems.value.length) list.push({ group: 'resource', title: GROUP_META.resource, items: resourceItems.value })
  if (processItems.value.length) list.push({ group: 'process', title: GROUP_META.process, items: processItems.value })
  if (statsItems.value.length) list.push({ group: 'stats', title: GROUP_META.stats, items: statsItems.value })
  if (systemItems.value.length) list.push({ group: 'system', title: GROUP_META.system, items: systemItems.value })
  if (masterItems.value.length) list.push({ group: 'master', title: GROUP_META.master, items: masterItems.value })
  return list
})

// 折叠状态（默认全部展开）
const openGroups = ref<Record<string, boolean>>({
  system: true,
  resource: true,
  process: true,
  master: true,
  stats: true,
})
function toggleGroup(group: string) {
  openGroups.value[group] = !openGroups.value[group]
}

async function onLogout() {
  await logout()
}
</script>

<template>
  <aside class="w-56 bg-slate-800 text-slate-100 flex flex-col" data-testid="app-sidebar">
    <div class="px-4 py-5 border-b border-slate-700">
      <div class="text-sm text-slate-300">实验室管理系统</div>
      <div class="text-xs text-slate-400 mt-1" data-testid="sidebar-role">角色：{{ role }}</div>
    </div>
    <nav class="flex-1 py-2 space-y-1 overflow-y-auto min-h-0">
      <!-- 仪表盘独立入口（对齐 React Layout.tsx 顶部 NavLink） -->
      <RouterLink
        v-if="dashboardItem"
        :to="dashboardItem.path"
        class="block px-4 py-2 mb-2 text-sm hover:bg-slate-700 transition-colors"
        active-class="bg-blue-600 text-white"
        data-testid="sidebar-dashboard"
      >
        <span :data-testid="`sidebar-link-${dashboardItem.name}`">{{ dashboardItem.title }}</span>
      </RouterLink>

      <!-- 5 分组（可折叠）：系统管理/资源管理/试验过程管理/基础数据/数据统计 -->
      <div v-for="section in sections" :key="section.group" class="mb-2" :data-testid="`sidebar-group-${section.group}`">
        <button
          type="button"
          class="flex items-center justify-between w-full px-4 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-200 transition-colors"
          data-testid="sidebar-group-title"
          @click="toggleGroup(section.group)"
        >
          <span>{{ section.title }}</span>
          <span class="text-[10px]">{{ openGroups[section.group] ? '▾' : '▸' }}</span>
        </button>
        <div v-if="openGroups[section.group]" class="mt-1 flex flex-col gap-0.5">
          <RouterLink
            v-for="item in section.items"
            :key="item.name"
            :to="item.path"
            class="block px-4 py-1.5 ml-2 text-sm rounded transition-colors"
            active-class="bg-blue-600 text-white"
            :data-testid="`sidebar-link-${item.name}`"
          >
            {{ item.title }}
          </RouterLink>
        </div>
      </div>
    </nav>
    <div class="px-4 py-3 border-t border-slate-700">
      <div class="text-xs text-slate-400 mb-2" data-testid="sidebar-user">
        {{ user?.displayName ?? '未登录' }}
      </div>
      <button
        class="w-full text-sm py-1.5 px-3 bg-slate-700 hover:bg-slate-600 rounded text-slate-100"
        data-testid="sidebar-logout"
        @click="onLogout"
      >
        退出登录
      </button>
    </div>
  </aside>
</template>