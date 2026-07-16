import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// 懒加载路由组件（eager 默认 false，是静态字面量 → vitest 的 import-glob 可静态解析）。
// dev 下 main.ts 会在 MSW 注册 Service Worker 之前把这些模块全部预加载（进入浏览器缓存），
// 从而绕开 MSW SW 对 /src/* 动态导入的拦截；生产构建不走 MSW，保持按需分块。
// 覆盖 views 与 layouts（根布局 MainLayout 也在懒加载之列）。
export const routeModuleLoaders = import.meta.glob('../{views,layouts}/**/*.vue')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function view(p: string): any {
  return routeModuleLoaders[p]
}

// 路由元信息：
//   meta.requiresAuth=true：需登录（未登录跳 /login）
//   meta.roles=string[]：要求当前用户角色在列表中（不在则跳 /403）
//   meta.title：页面标题（守卫里同步 document.title）
//   meta.group：侧边栏分组（'system'系统管理/'resource'资源管理/'process'试验过程管理/'master'基础数据/'stats'数据统计）——对齐 React Layout.tsx 五菜单
//   meta.menuOrder：分组内排序（越小越靠前）；不填则按路由表顺序
export interface AppRouteMeta {
  requiresAuth?: boolean
  roles?: string[]
  title?: string
  /** 菜单项所需权限码（侧边栏 computed 过滤用） */
  permissions?: string[]
  /** 侧边栏分组：system=系统管理 / resource=资源管理 / process=试验过程管理 / master=基础数据 / stats=数据统计 */
  group?: 'system' | 'resource' | 'process' | 'master' | 'stats'
  /** 分组内排序号（越小越靠前，默认 99） */
  menuOrder?: number
}

declare module 'vue-router' {
  // noinspection JSUnusedGlobalSymbols
  interface RouteMeta extends AppRouteMeta {
    title?: string
    requiresAuth?: boolean
    roles?: string[]
    group?: 'system' | 'resource' | 'process' | 'master' | 'stats'
  }
}

// 业务页面全部懒加载（动态 import）—— 命中时才请求对应 chunk，首屏只载主布局。
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: view('../views/Login.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/',
    component: view('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: view('../views/Dashboard.vue'),
        meta: { title: '工作台', permissions: ['project:read'] },
      },
      {
        path: 'contracts',
        name: 'contracts',
        component: view('../views/inspection/ProjectList.vue'),
        meta: { title: '合同管理', group: 'resource', menuOrder: 1, permissions: ['project:read'] },
      },
      // 旧 path 兼容（ch36 时命名 inspection/projects，v1.1-011 改名 contracts 但保留 alias）
      { path: 'inspection/projects', redirect: '/contracts' },
      {
        path: 'receipts',
        name: 'receipts',
        component: view('../views/receipts/ReceiptList.vue'),
        meta: { title: '接样管理', group: 'process', menuOrder: 2, permissions: ['sample:read'] },
      },
      // 旧 path 兼容（v1.0-011 用 inspection/flow，v1.1-011 用 /flow 但保留 alias）
      { path: 'inspection/flow', redirect: '/flow' },
      {
        path: 'flow',
        name: 'flow',
        component: view('../views/inspection/FlowPanel.vue'),
        meta: { title: '流程面板', permissions: ['report:read'] },
      },
      {
        path: 'data-entry',
        name: 'data-entry',
        component: view('../views/data-entry/DataEntryPage.vue'),
        meta: { title: '数据录入', group: 'process', menuOrder: 4, permissions: ['report:read'] },
      },
      {
        path: 'samples',
        name: 'samples',
        component: view('../views/samples/SampleList.vue'),
        meta: { title: '样品管理', permissions: ['report:read'] },
      },
      {
        path: 'task-assignment',
        name: 'task-assignment',
        component: view('../views/task-assignment/TaskAssignmentPage.vue'),
        meta: { title: '任务安排', group: 'process', menuOrder: 3, permissions: ['report:write'] },
      },
      {
        path: 'report-review',
        name: 'report-review',
        component: view('../views/reports/ReportReview.vue'),
        meta: { title: '报告审核', group: 'process', menuOrder: 5, permissions: ['report:read'] },
      },
      {
        path: 'report-approve',
        name: 'report-approve',
        component: view('../views/reports/ReportApproval.vue'),
        meta: { title: '报告批准', group: 'process', menuOrder: 6, permissions: ['report:read'] },
      },
      // 旧 path 兼容（v1.1-011 用 /report-approval，v2.0-011 对齐 React /report-approve 但保留 alias）
      { path: 'report-approval', redirect: '/report-approve' },
      {
        path: 'report-issue',
        name: 'report-issue',
        component: view('../views/reports/ReportIssuance.vue'),
        meta: { title: '报告发放', group: 'process', menuOrder: 7, permissions: ['report:read'] },
      },
      // 旧 path 兼容（v1.1-011 用 /report-issuance，v2.0-011 对齐 React /report-issue 但保留 alias）
      { path: 'report-issuance', redirect: '/report-issue' },
      {
        path: 'report-archive',
        name: 'report-archive',
        component: view('../views/reports/ReportArchive.vue'),
        meta: { title: '报告归档', group: 'process', menuOrder: 8, permissions: ['report:read'] },
      },
      {
        path: 'receipt/:id',
        name: 'receipt-detail',
        component: view('../views/receipts/ReceiptDetailPage.vue'),
        // 接样单详情不进入侧边栏菜单（仅作为「查看详情」跳转目标；删除 group 即从所有分组过滤中漏出）
        meta: { title: '接样单详情', permissions: ['sample:read'] },
      },
      {
        path: 'summary',
        name: 'summary',
        component: view('../views/Summary.vue'),
        meta: { title: '统计汇总', group: 'stats', menuOrder: 9, permissions: ['report:read'] },
      },
      {
        path: 'org-info',
        name: 'org-info',
        component: view('../views/OrgInfo.vue'),
        meta: { title: '机构信息', group: 'system', menuOrder: 1, permissions: ['user:read'] },
      },
      {
        path: 'audit',
        name: 'audit',
        component: view('../views/audit/AuditLogList.vue'),
        meta: { title: '审计日志', group: 'system', menuOrder: 4, permissions: ['audit:read'] },
      },
      {
        path: 'settings/users',
        name: 'settings-users',
        component: view('../views/settings/UsersList.vue'),
        meta: { title: '用户管理', group: 'system', menuOrder: 3, permissions: ['user:read'] },
      },
      {
        path: 'settings/roles',
        name: 'settings-roles',
        component: view('../views/settings/RolesList.vue'),
        meta: { title: '角色管理', group: 'system', menuOrder: 2, permissions: ['role:read'] },
      },
      {
        path: 'settings',
        name: 'settings',
        component: view('../views/settings/SettingsLayout.vue'),
        meta: { title: '系统设置', permissions: ['user:read'] },
        redirect: '/settings/users',
      },
      {
        path: 'report-categories',
        name: 'report-categories',
        component: view('../views/settings/ReportCategoriesList.vue'),
        meta: { title: '报告类别', group: 'master', menuOrder: 1, permissions: ['user:read'] },
      },
      {
        path: 'test-parameters',
        name: 'test-parameters',
        component: view('../views/settings/TestParametersList.vue'),
        meta: { title: '检测参数', group: 'master', menuOrder: 4, permissions: ['user:read'] },
      },
      {
        path: 'test-standards',
        name: 'test-standards',
        component: view('../views/settings/TestStandardsList.vue'),
        meta: { title: '标准管理', group: 'master', menuOrder: 3, permissions: ['user:read'] },
      },
      {
        path: 'technical-requirements',
        name: 'technical-requirements',
        component: view('../views/settings/TechnicalRequirementsList.vue'),
        meta: { title: '技术要求', group: 'master', menuOrder: 6, permissions: ['user:read'] },
      },
      {
        path: 'report-templates',
        name: 'report-templates',
        component: view('../views/settings/ReportTemplatesList.vue'),
        meta: { title: '报告模板', group: 'master', menuOrder: 11, permissions: ['user:read'] },
      },
      {
        path: 'models',
        name: 'models',
        component: view('../views/settings/DictList.vue'),
        meta: { title: '型号维护', group: 'master', menuOrder: 7, permissions: ['user:read'] },
      },
      {
        path: 'specifications',
        name: 'specifications',
        component: view('../views/settings/DictList.vue'),
        meta: { title: '规格维护', group: 'master', menuOrder: 8, permissions: ['user:read'] },
      },
      {
        path: 'grades',
        name: 'grades',
        component: view('../views/settings/DictList.vue'),
        meta: { title: '等级维护', group: 'master', menuOrder: 9, permissions: ['user:read'] },
      },
      {
        path: 'brands',
        name: 'brands',
        component: view('../views/settings/DictList.vue'),
        meta: { title: '牌号维护', group: 'master', menuOrder: 10, permissions: ['user:read'] },
      },
      {
        path: 'calculation-rules',
        name: 'calculation-rules',
        component: view('../views/settings/CalculationRulesList.vue'),
        meta: { title: '计算规则', group: 'master', menuOrder: 5, permissions: ['user:read'] },
      },
      {
        path: 'contract-categories',
        name: 'contract-categories',
        component: view('../views/settings/ContractCategoriesList.vue'),
        meta: { title: '合同类别', group: 'master', menuOrder: 2, permissions: ['user:read'] },
      },
    ],
  },
  {
    path: '/403',
    name: 'forbidden',
    component: view('../views/Forbidden.vue'),
    meta: { title: '无权限' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: view('../views/NotFound.vue'),
    meta: { title: '页面不存在' },
  },
]

export { routes }

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 切换路由时滚动到顶部（带锚点时滚到对应元素）
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

// 全局前置守卫（ch35）：登录态校验 + 角色校验。
// 守卫逻辑抽成函数，方便单测里 applyAuthGuard(testRouter) 复用同一份逻辑。
export function applyAuthGuard(target: import('vue-router').Router) {
  target.beforeEach(async (to) => {
    if (to.meta.title) document.title = `${to.meta.title} - 实验室管理系统`
    const meta = to.meta as AppRouteMeta
    if (!meta.requiresAuth) return true

    const auth = useAuthStore()
    // 进入受保护页面前从 localStorage 恢复登录态（首次刷新页面场景）
    if (!auth.isAuthenticated) {
      auth.restore()
    }
    if (!auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (meta.roles && meta.roles.length > 0 && !meta.roles.includes(auth.role)) {
      return { name: 'forbidden' }
    }
    return true
  })
}

applyAuthGuard(router)