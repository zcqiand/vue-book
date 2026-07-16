import { createApp } from 'vue'
import App from './App.vue'

console.log('[env] MODE =', import.meta.env.MODE)
console.log('[env] VITE_API_BASE =', import.meta.env.VITE_API_BASE)
console.log('[env] VITE_DEBUG =', import.meta.env.VITE_DEBUG)
console.log('[env] VITE_APP_NAME =', import.meta.env.VITE_APP_NAME)

createApp(App).mount('#app')