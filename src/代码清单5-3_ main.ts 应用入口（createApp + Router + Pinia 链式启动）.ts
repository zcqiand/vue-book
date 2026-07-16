import { createApp } from 'vue'
// 根组件 App、路由表 router、Pinia 工厂函数 createPinia 全部备好
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './assets/main.css' // 引入全局样式（顺序上 import 会被打包工具提升到顶部，与 use 无关）

// 链式调用：① 创建应用实例 → ② 注册插件（先 router 后 pinia）→ ③ 挂载到 #app
createApp(App).use(router).use(createPinia()).mount('#app')