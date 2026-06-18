# 1. 初始化全新的 Vue 3 + TS + Vite 项目骨架
# 交互式选项中依次开启 TypeScript / Vue Router / Pinia / ESLint
# 选择时不勾选 Vitest、Cypress 等可后续按需补，避免初始依赖膨胀
npm create vue@latest

# 2. 假设新项目命名为 vue3-app，进入目录安装依赖
cd vue3-app
npm install

# 3. 安装 mitt（替代 Vue 2 事件总线）与其他第三方库
# 注意 axios、lodash 等与 Vue 版本无关的库可直接沿用，无需重装
npm install mitt

# 4. 把旧 src 目录按职责搬到新项目
# components/views 直接拷贝；router/store 需重写为 Vue Router 4 与 Pinia 写法
# 这一步不直接覆盖：先在新项目的 src 下建 legacy 子目录暂存，逐个迁移改造
cp -r ../old-vue2-project/src/components ./src/components

# 5. 环境变量改名：Vue CLI 用 VUE_APP_ 前缀，Vite 只认 VITE_ 前缀
# 否则 import.meta.env.VITE_API_BASE 永远是 undefined，请求会落到错误地址
# 这一步必须连同业务代码里的 process.env.VUE_APP_XXX 一并改为 import.meta.env.VITE_XXX
# .env 文件内的键名也要从 VUE_APP_API_BASE 改为 VITE_API_BASE

# 6. 全局 API 改应用实例 API
# Vue.prototype.$http = axios  改为  app.config.globalProperties.$http = axios
# 但更推荐改为显式 import 或 Composable，globalProperties 在 Vue 3 是被边缘化的写法

# 7. Vue Router 3 改 4（详见路由章节）
# new VueRouter({ routes }) 改为 createRouter({ routes, history: createWebHistory() })
# 路由守卫 next 回调在 Vue Router 4 中已不再强制，return 路由对象或布尔值即可

# 8. Vuex 改 Pinia（详见状态管理章节）
# new Vuex.Store({ state, mutations, actions }) 改为 defineStore('xxx', () => { ... })
# mutations 在 Pinia 中被取消：actions 既可同步也可异步，心智模型更简单

# 9. 启动开发服务器验证
# 启动后控制台应看到 Vite ready，浏览器自动打开 http://localhost:5173
# 若看到 process is not defined 报错，多半是 .env 改名遗漏或代码里残留 process.env
npm run dev