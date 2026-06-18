import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',  // 在 Node 中模拟 DOM 环境
    globals: true,        // describe/it/expect 全局可用（无需 import）
    setupFiles: [],       // 测试前运行的配置文件
  },
})