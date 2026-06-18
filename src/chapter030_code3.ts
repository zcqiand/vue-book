// ❌ 错误写法：setup 顶层调用随机值，SSR 与客户端结果不一致
const now = new Date().toLocaleString()
const randomId = Math.random()