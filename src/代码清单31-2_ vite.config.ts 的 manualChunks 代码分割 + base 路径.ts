import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  // 部署到域名根目录时用 './'；部署到子路径如 https://example.com/my-app/ 时改 '/my-app/'
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 对象形式：键是 chunk 名，值是要合并进来的依赖数组
        // 把这三个框架级依赖打进同一个 vendor chunk，长期稳定、利于浏览器缓存命中
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})