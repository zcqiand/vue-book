import { reactive, shallowReactive } from 'vue'

// 场景：仪表盘配置对象，结构深但大多数字段不变
interface DashboardConfig {
  meta: {
    title: string       // 改 meta.title 不会触发响应式更新（shallowReactive）
    version: string
  }
  layout: {
    columns: number     // 改 layout.columns 会触发（第一层）
    rows: number
  }
  items: Array<{
    id: string
    name: string       // 改 items[0].name 不会触发
    selected: boolean  // 改 items[0].selected 不会触发
  }>
  filter: {
    category: string
    dateRange: string
  }
}

// 错误用法（reactive）：所有深层变化都会触发更新，可能导致频繁重渲染
// const config = reactive<DashboardConfig>({ ... })

// 正确用法（shallowReactive）：只代理第一层，结构更轻量
const config = shallowReactive<DashboardConfig>({
  meta: { title: 'Dashboard', version: '1.0.0' },
  layout: { columns: 3, rows: 2 },
  items: [],
  filter: { category: 'all', dateRange: '7d' },
})

// ✅ 第一层属性变化 → 会触发更新
config.layout.columns = 4  // 触发响应式更新

// ❌ 深层属性变化 → 不会触发更新（shallowReactive 的特性）
config.meta.title = 'New Title'       // 不触发
config.items[0].name = 'Updated'     // 不触发

// ⚠️ 如果需要深层变化也触发，必须用 reactive，或手动替换整个对象
// 方案一：手动替换深层对象
config.meta = { ...config.meta, title: 'New Title' }  // .value 替换，触发更新

// 方案二：使用 reactive 而非 shallowReactive（但有性能代价）
const configDeep = reactive<DashboardConfig>({ ... })
configDeep.meta.title = 'New Title'   // 触发更新（但深层追踪有开销）