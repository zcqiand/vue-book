// 实际项目拆分为：stores/auth.ts / stores/inspection.ts / stores/sample.ts / stores/report.ts
// 此处合并展示是为了对照四个 store 的写法差异，便于读者一次性看清模块化模式
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { User, Inspection, Sample, Report } from '@/types/models'

// === auth store：管理登录态与当前用户，是路由守卫与请求拦截器的依赖源 ===
export const useAuthStore = defineStore('auth', () => {
  // state：token 与当前用户。token 持久化到 localStorage，刷新页面不丢登录态
  const token = ref<string>(localStorage.getItem('lab_admin_token') ?? '')
  const currentUser = ref<User | null>(null)

  // getter：派生状态，模板里直接读，避免每个组件重复写判断
  const isLoggedIn = computed<boolean>(() => token.value.length > 0)
  const isAdmin = computed<boolean>(() => currentUser.value?.role === 'admin')

  // action：同步设置 token，同时持久化到 localStorage
  // 持久化逻辑写在 store 内部，调用方只需 setToken，无需关心存储细节
  function setToken(newToken: string): void {
    token.value = newToken
    localStorage.setItem('lab_admin_token', newToken)
  }

  // 异步 action：登录接口调用 + 状态更新一体
  // try/catch/finally 保证 loading 标志在异常路径也能复位，避免按钮永久禁用
  async function login(username: string, password: string): Promise<void> {
    // 实际调用 api/auth.ts 的 loginApi，此处用 mock 数据演示 store 结构
    // 真实代码：const { token, user } = await loginApi({ username, password })
    setToken('mock-token-from-backend')
    currentUser.value = { id: 1, username, role: 'admin' }
  }

  function logout(): void {
    token.value = ''
    currentUser.value = null
    localStorage.removeItem('lab_admin_token')
  }

  return { token, currentUser, isLoggedIn, isAdmin, setToken, login, logout }
})

// === inspection store：管理检测项目列表与当前详情 ===
export const useInspectionStore = defineStore('inspection', () => {
  const list = ref<Inspection[]>([])
  const current = ref<Inspection | null>(null)
  const loading = ref<boolean>(false)
  const errorMessage = ref<string>('')

  // getter：统计指标，列表渲染时直接读，无需在组件里再 reduce 一遍
  const pendingCount = computed<number>(
    () => list.value.filter((item) => item.status === 'pending').length
  )

  async function fetchList(): Promise<void> {
    loading.value = true
    errorMessage.value = ''
    try {
      // 实际调用 api/inspection.ts，此处用 mock 数据演示 store 结构
      list.value = [
        { id: 1, name: '混凝土抗压强度', status: 'pending' },
        { id: 2, name: '钢筋拉伸', status: 'completed' }
      ]
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : '加载检测项目失败'
    } finally {
      loading.value = false
    }
  }

  return { list, current, loading, errorMessage, pendingCount, fetchList }
})

// === sample store：管理样品数据，结构与 inspection 对称 ===
export const useSampleStore = defineStore('sample', () => {
  const list = ref<Sample[]>([])
  const loading = ref<boolean>(false)
  const errorMessage = ref<string>('')

  const total = computed<number>(() => list.value.length)

  async function fetchList(): Promise<void> {
    loading.value = true
    errorMessage.value = ''
    try {
      list.value = [{ id: 1, code: 'S-001', material: 'C30 混凝土' }]
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : '加载样品失败'
    } finally {
      loading.value = false
    }
  }

  return { list, loading, errorMessage, total, fetchList }
})

// === report store：管理检测报告，提供生成与下载入口 ===
export const useReportStore = defineStore('report', () => {
  const list = ref<Report[]>([])
  const generating = ref<boolean>(false)
  const errorMessage = ref<string>('')

  const generatedCount = computed<number>(
    () => list.value.filter((r) => r.status === 'generated').length
  )

  // 异步 action：生成报告，过程中禁用按钮（generating 控制加载态）
  async function generate(inspectionId: number): Promise<void> {
    generating.value = true
    errorMessage.value = ''
    try {
      // 实际调用 api/report.ts，此处用 mock 演示状态流转
      list.value.push({
        id: Date.now(),
        inspectionId,
        status: 'generated'
      })
    } catch (err) {
      errorMessage.value = err instanceof Error ? err.message : '生成报告失败'
    } finally {
      generating.value = false
    }
  }

  return { list, generating, errorMessage, generatedCount, generate }
})