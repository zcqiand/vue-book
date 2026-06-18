# Vue 从入门到项目实践 - 代码清单

> **本书配套代码示例库** — 从章节中提取的完整可运行代码

## 关于本书

过去几年里，我在团队里带过不少刚入行的前端、转过岗的全栈预备役，也接手过几个被前任留下的 Vue 2 老项目。最常听到的吐槽是：「网上的 Vue 教程越看越乱。」一开始我以为只是学习路径问题，后来才发现是结构性的——他们看到的教程要么停在 Vue 2 + Options API 的旧范式（Vue 2 早在 2023 年 12 月 31 日就官方停止维护了），要么是 Vue 3 早期的「视频教学版」式 API 罗列，没人系统讲 `ref` 还是 `reactive`、Pinia 还是组件状态、Options 还是 Composition、CSR 还是 SSR/Nuxt——什么时候用、为什么。

这本书就是为了把这些「为什么」一次讲清楚而写的——它不是又一本 Vue API 字典，而是一份带决策框架、带两个真实企业项目的成长路径。

## 本书特点

**第一，版本最新 + 范式迁移导向。** 全书锁定 Vue 3.5.x（2025 年 Tengen Toppa 大版本）+ TypeScript 5.x，明确以 Composition API + `<script setup>` 为首选范式。Options API 不消失，但只在「对照与旧代码阅读」的语境里简要出现。

**第二，决策框架驱动。** 本书每一个技术点都配「什么时候用、为什么」。`ref` vs `reactive`、Pinia vs 组件状态 vs `provide/inject`、CSR vs SSR/Nuxt——这些工程界最纠结的选型问题，书里都给出明确的决策框架。

**第三，TypeScript 全程贯穿，不是一章附录。** TypeScript 与 Vue 的集成从第 16 章正式落地，之后每一章的代码都带完整类型标注，`defineProps` 泛型、`ref` 泛型、`computed` 返回类型、`emit` 事件载荷、`vue-tsc` 类型检查贯穿到底。

**第四，两个完整企业级项目。** 第四部分实现了建筑工程实验室管理系统、SaaS 统一身份管理系统两个端到端项目，与姊妹篇《React 从入门到项目实践》复用同款业务需求与接口契约，可直接用于双栈对照学习。

## 谁应该读这本书

如果你希望系统进入 Vue 3.5 时代，并真正建立选型判断力，这本书适合你。你可能是：

- 零前端基础或仅有少量 JavaScript 经验的初学者；
- 即将进入前端岗位或正在转行前端的求职者；
- 后端、移动端、设计等岗位需要补齐 Vue 技能的全栈预备役；
- 在校学生与培训机构学员，需要一份出版级系统教程而非视频片段；
- 已经在维护 Vue 2 老项目、需要被迫迁移到 Vue 3 的存量开发者。

## 代码清单说明

本目录包含从书籍章节中提取的代码示例文件，覆盖全书 42 章的核心知识点。

### 📊 代码统计

- **总文件数**: 610 个
- **涉及章节**: 第 1—42 章（全书四个学习弧线全覆盖）

### 📋 按文件类型分类

| 类型       | 文件数 | 说明                                       |
| ---------- | ------ | ------------------------------------------ |
| TXT        | 332    | 模板片段、终端输出、配置文本、说明性代码块 |
| TypeScript | 251    | `<script setup lang="ts">`、Composables、Pinia store、类型定义 |
| Shell      | 9      | 项目脚手架、构建与部署命令                 |
| JSON       | 7      | `package.json`、`vercel.json`、API 响应等  |
| JavaScript | 4      | 旧式范式对照、Vite 配置补充                |
| CSS        | 4      | Tailwind 配置补充与样式片段                |
| HTML       | 2      | `index.html` 入口与静态片段                |

### 📂 章节覆盖

- **第一部分 入门基础（第 1—9 章）**：Vue 定位、JavaScript 前置补课、`create-vue` 环境搭建、SFC 单文件组件、Props 与组件通信、事件处理与表单、Tailwind CSS 样式、条件与列表渲染。
- **第二部分 响应式与核心机制（第 10—18 章）**：响应式心智与解包陷阱、`computed` / `watch`、生命周期与模板引用、Composables、TypeScript 集成、组件设计模式、表单进阶。
- **第三部分 工程化与生态（第 19—33 章）**：Vue Router 路由、数据获取、`provide/inject`、Pinia 状态、错误处理、Vue 3.5 新特性与内置组件、性能优化、Vitest 测试、Nuxt SSR/SSG、构建部署、前后端联调、Vue 2 → Vue 3 迁移指南。
- **第四部分 企业级项目实战（第 34—42 章）**：建筑工程实验室管理系统（Ch34—38）、SaaS 统一身份管理系统（Ch39—42）。

## 如何使用代码

### 环境准备

- **Node.js**: 20 LTS（官方要求 `^20.19.0 || >=22.12.0`），推荐 nvm 或 fnm 管理多版本
- **包管理器**: pnpm 9+（推荐）或 npm 10+
- **Vue**: 3.5.x
- **TypeScript**: 5.x
- **Vite**: 5.x
- **编辑器**: Visual Studio Code，并安装 **Vue - Official**（原 Volar）扩展
- **浏览器**: Chrome / Edge 最新稳定版，并安装 **Vue DevTools** 扩展

### 文件命名规范

代码清单使用两种命名格式并存：

```text
chapter{章节号:03d}_code{序号}.{扩展名}
代码清单{章节号}-{序号}[（变体）].{扩展名}
```

示例：

- `chapter012_code10.ts` — 第 12 章第 10 个 TypeScript 片段
- `chapter017_code3.txt` — 第 17 章第 3 个文本/模板片段
- `代码清单10-1.ts` — 第 10 章代码清单 1（响应式核心示例）
- `代码清单32-4：axios 实例 + 请求.ts` — 第 32 章代码清单 4（含说明后缀）

带「续」「（续）」「a / b / c」后缀的文件，是同一代码清单的延续片段，按字母或「续」顺序拼接为完整代码。

### 运行示例

**TypeScript / Vue 单文件示例**：

```bash
pnpm install
pnpm vue-tsc --noEmit src/代码清单10-1.ts
```

**完整项目（第四部分实战章节）**：参考对应章节的章首「环境与依赖」小节，按 `pnpm create vue@latest` 脚手架步骤复刻。

**Shell 脚本**：

```bash
bash src/chapter008_code2.sh
```

**配置文件**：直接放入对应工程的相应位置（例如 `vite.config.ts`、`.env.production`、Nginx 配置等）。

### 代码说明

每个代码文件来自书中明确标号的代码清单（`代码清单 N-N`），可在《Vue从入门到项目实践》正文对应章节回溯上下文。本书 42 章按四个学习弧线展开，建议先读章节正文，再回到本目录运行对应代码片段。

## 配套资源

- **GitHub 仓库**: [https://github.com/zcqiand/vue-book](https://github.com/zcqiand/vue-book)
- **勘误页面**: [https://github.com/zcqiand/vue-book/issues](https://github.com/zcqiand/vue-book/issues)
- **姊妹篇（双栈对照）**: [https://github.com/zcqiand/react-book](https://github.com/zcqiand/react-book)
- **读者交流**: 1282301776@qq.com

## ⚠️ 注意事项

1. **代码版本**: 代码基于 Vue 3.5.x + TypeScript 5.x + Vite 5.x（2026 年春基线）编写，生态库（Pinia、Vue Router、Nuxt、Vitest）请以章节首页声明的版本为准
2. **依赖安装**: 部分章节（Pinia、Vue Router、Nuxt、Vitest、Tailwind 等）需要安装额外依赖，参见对应章节正文
3. **范式锁定**: 所有示例默认 Composition API + `<script setup>`，仅在第三部分迁移章节出现 Options API 对照代码，请勿混用
4. **类型检查**: 全书代码以 `vue-tsc --noEmit` 通过为基准，TypeScript 严格模式下编写，运行前建议执行类型检查
5. **企业级项目**: 第四部分两个项目复用同款后端接口契约，本仓库仅含前端代码，后端 mock / 真实服务请按章节说明自行准备

---

**最后更新**: 2026 年春
**书籍版本**: 1.0
**代码来源**: [../chapters](../chapters/)
