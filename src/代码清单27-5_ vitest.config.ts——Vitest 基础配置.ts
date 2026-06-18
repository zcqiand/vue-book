// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',  // 在 Node.js 环境下模拟浏览器 DOM API
    globals: true,         // describe/it/expect 等全局可用，无需每次 import
  }
})