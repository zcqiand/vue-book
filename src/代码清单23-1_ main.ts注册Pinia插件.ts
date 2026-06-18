// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

// 创建 pinia 实例并注册为 Vue 插件
app.use(createPinia())

app.mount('#app')