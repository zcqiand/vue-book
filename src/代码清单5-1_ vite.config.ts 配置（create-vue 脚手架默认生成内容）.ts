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
})