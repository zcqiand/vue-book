import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// defineConfig 提供配置项的类型提示，写错字段编辑器会立刻报红
export default defineConfig({
  plugins: [
    vue(), // 注册 Vue 插件，让 Vite 能编译 .vue 单文件组件
  ],
  resolve: {
    alias: {
      // @ 指向 src 目录，import 时可写 '@/components/UserCard.vue' 代替相对路径
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173, // 开发服务器端口，默认 5173
    open: false, // 启动时是否自动打开浏览器
    proxy: {
      // 联调时把以 /api 开头的请求代理到后端，绕过浏览器跨域限制
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})