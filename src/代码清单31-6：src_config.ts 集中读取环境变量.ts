// 集中收敛环境变量读取：业务代码统一从 config 取值，避免散落的 import.meta.env 调用
export const appConfig = {
  apiBase: import.meta.env.VITE_API_BASE,
  appTitle: import.meta.env.VITE_APP_TITLE ?? '未命名应用'
} as const

// 缺失关键变量时尽早抛错，避免运行时才发现 API 地址为 undefined
if (!appConfig.apiBase) {
  throw new Error('VITE_API_BASE 未配置，请检查 .env 文件')
}