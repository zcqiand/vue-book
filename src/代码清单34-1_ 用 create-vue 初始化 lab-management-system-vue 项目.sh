# 在准备存放项目的目录下执行，不要在已有 package.json 的目录里跑，否则会询问是否覆盖
# npm create vue@latest 会拉取 create-vue 的最新版本（随 Vue 主版本对齐）
npm create vue@latest

# === 以下为 create-vue 的交互式问答，逐条说明推荐选择 ===

# 问题 1：Project name（项目名）
# 输入：lab-management-system-vue
# 项目名将作为 package.json 的 name 字段与目录名，全小写连字符是 npm 包命名规范

# 问题 2：Add TypeScript?（是否启用 TypeScript）
# 选择：Yes
# 企业级项目必选：类型检查能在编译期拦截大量低级错误，重构时编辑器能精确跳转

# 问题 3：Add JSX Support?（是否启用 JSX）
# 选择：No
# 本书统一用 <template> 写模板，JSX 仅在高级渲染函数场景需要，初学阶段开启只会增加心智负担

# 问题 4：Add Vue Router for Single Page App development?（是否启用 Vue Router）
# 选择：Yes
# lab-management-system-vue 是多页面管理系统，路由是必需品；勾选后 create-vue 自动写入 router/index.ts 与示例路由

# 问题 5：Add Pinia for state management?（是否启用 Pinia）
# 选择：Yes
# Pinia 是 Vue 3 官方推荐的状态管理库，setup store 写法与 Composition API 完全一致

# 问题 6：Add Vitest for Unit Testing?（是否启用 Vitest 单元测试）
# 选择：Yes
# 后续 store、composable、组件都要写测试，Vitest 与 Vite 共用配置，启动飞快

# 问题 7：Add an End-to-End Testing Solution?（是否启用 E2E 测试）
# 选择：No
# E2E 工具（Playwright/Cypress）安装重、初学阶段不必要，等业务稳定后再按需补

# 问题 8：Add ESLint for code quality?（是否启用 ESLint）
# 选择：Yes
# 团队协作必需：统一代码风格、拦截未使用变量、强制类型导入规范

# 问题 9：Add Prettier for code formatting?（是否启用 Prettier）
# 选择：Yes
# Prettier 负责格式化，ESLint 负责逻辑规则，两者分工配合；create-vue 已处理好冲突规则

# === 交互式问答结束，create-vue 自动生成项目骨架 ===

# 进入项目目录并安装依赖（create-vue 不会自动 npm install，需手动执行）
cd lab-management-system-vue
npm install

# 启动开发服务器验证骨架是否正常
# Vite 6 默认监听 http://localhost:5174，浏览器打开能看到 Vue 欢迎页即说明骨架可用
npm run dev