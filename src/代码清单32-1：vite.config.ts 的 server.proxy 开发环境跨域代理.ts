import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    // @ 别名指向 src，业务代码统一用 @/components/... 写导入，避免相对层级过深
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      // 凡是 /api 开头的请求都走代理，键是要拦截的前缀
      '/api': {
        target: 'http://localhost:8080',
        // changeOrigin 把请求头里的 Host 改写成 target 的域名
        // 后端常按 Host 做权限校验或日志，不改会被识别为来自 5173 而非本机后端
        changeOrigin: true
        // 不写 rewrite：保留 /api 前缀，转发后 URL 是 http://localhost:8080/api/users
        // 若后端路由本身不带 /api 前缀，需加 rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 框架三件套单独打包：业务代码改动时 vendor chunk 的 hash 不变，浏览器长缓存命中
        manualChunks: {
          vue: ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})