// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// 过渡期兼容：组件里仍可写 this.$message 拿到 message 实例
// 但这是被边缘化的写法：能改 import 就改 import，改不动再走这一步
app.config.globalProperties.$message = {
  success(text: string) {
    console.log('[success]', text)
  }
}

app.mount('#app')