# Vue从入门到项目实践 - 代码清单

## 关于本书

《Vue 从入门到项目实践》是一本全程锁定 Vue 3.5.x + TypeScript 5.x 的零基础系统教程：以 Composition API + `<script setup>` 为首选范式，带你从第一行代码走到两个企业级生产项目。工程栈一站式覆盖 Vite 6 构建、Vue Router 4 路由、Pinia 状态管理、Tailwind CSS 4 样式、Vitest + Vue Test Utils 测试与 Nuxt 3 SSR/SSG。

全书 42 章按四卷展开：基础篇补齐 ES6+ 前置语法并建立响应式心智模型；进阶篇讲透组件、插槽、组合式函数与 TypeScript 集成；综合能力篇覆盖路由、状态选型、表单与测试；项目实战篇完整交付两个相互独立的企业级项目——实验室管理系统（LIMS）与 SaaS 统一身份管理系统，覆盖 SSO 认证、RBAC 权限与流程状态机。Options API 仅作为「对照与旧代码阅读」简要呈现，读者从一开始就站在 Vue 2 停止维护之后的正确范式上。

如果你有基础 HTML/CSS 和少量 JavaScript 经验，希望系统学习 Vue 并具备独立开发企业级应用的能力，这本书适合你：即将进入前端岗位或正在转行的求职者、需要补齐 Vue 技能的后端与移动端工程师、在校学生与培训学员，以及正在维护 Vue 2 老项目、需要迁移到 Vue 3 的存量开发者。

## 本书特点

**第一，范式迁移导向。** 全程以 Composition API + `<script setup>` 为首选范式，讲清相对 Options API 的取舍，帮读者跳出已停止维护的 Vue 2 旧范式，不在两套写法之间摇摆。

**第二，决策导向。** `ref` vs `reactive`、Pinia vs 组件状态 vs `provide/inject`、`computed` vs `method`、`watch` vs `watchEffect`、CSR vs SSR/Nuxt——每个技术点都配适用场景与选择理由，建立可迁移的选型决策框架。

**第三，TypeScript 全程贯穿。** TypeScript 不是附录式的一章，而是集成之后贯穿后续每一章的代码，`defineProps` 泛型与 `vue-tsc` 类型检查成为日常工程习惯。

**第四，双栈对照学习。** 两个企业级项目复用姊妹篇《React 从入门到项目实践》同款的业务需求与接口契约，前端架构与生产级代码复杂度完全对等，可双栈对照学习。

## 案例仓库

| 仓库名 | 说明 |
| :--- | :--- |
| [lab-management-system-vue](https://github.com/zcqiand/lab-management-system-vue) @ v0.3.40-20260925 | Vue 3.5 + TypeScript 5.7 + Vite 6 工程，Pinia 2 状态管理，@tanstack/vue-query 数据层，orval 生成的 API client，shadcn-vue（Reka UI）+ Tailwind v4 界面 |
| [saas-identity-platform-vue](https://github.com/zcqiand/saas-identity-platform-vue) @ v0.3.55-20260925 | Vue 3.5 + TypeScript 5.7 + Vite 6 工程，Pinia 2 状态管理，@tanstack/vue-query 数据层，orval（vue-query 插件）生成的 API client，shadcn-vue（Reka UI）+ Tailwind v4 界面 |

> 配套案例仓库为独立可跑工程，已冻结 tag，含完整测试与 CI，clone 即跑。

## 代码清单说明

本书所有代码清单均收录于本目录，对应书稿中「代码清单 N-M」标题块。

### 运行环境

```bash
# 本仓代码清单为 .vue/.ts 片段，需 Node.js 20 LTS 与 npm；建议用 create-vue 脚手架建工程运行
npm create vue@latest my-app
cd my-app
npm install
# 将本仓 src/ 下对应的代码清单文件复制进 src/ 后，启动开发服务器查看效果
npm run dev
```

### 目录结构

```
src/
├── 代码清单1-* … 代码清单42-*   # 第 1-42 章，共 413 个清单文件（命名「代码清单N-M_ 描述.扩展名」）
└── extracted_code_manifest.json   # 全部清单索引（title/lang/chapter_file/line/extracted_file/source）
```
