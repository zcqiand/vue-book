// vite.config.ts
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'  // ❶ 引入 Tailwind 4 的 Vite 插件

export default defineConfig({
  plugins: [
    vue(),          // ❷ 已有的 Vue 插件，create-vue 默认生成
    tailwindcss(),  // ❸ 注册 Tailwind 插件，自动扫描 .vue/.ts 按需生成 CSS
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})