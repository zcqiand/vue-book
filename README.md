# Vue 3.5 从入门到项目实践 - 代码清单

> **本书配套代码示例库** — 从章节中提取的完整可运行代码片段索引

## 关于本书

Vue 3.5 是 2024 年下半年发布的稳定版本，在 Composition API、响应式系统与模板语法上持续打磨，与 TypeScript + Vite + Pinia 组成现代 Vue 工程的标准范式。与此同时，中文 Vue 3 书籍市场长期停留在 Options API + Vue CLI 时代，市面上几乎找不到一本覆盖 Vue 3.5 + TypeScript + 现代工程栈的系统性指南。

本书基于 Vue 3.5 + TypeScript + Vite 6 + Vue Router 4 + Pinia 2 + Element Plus，从零基础带到独立交付企业级项目，帮助读者不仅掌握 Vue 的操作能力，更建立前端工程化的系统思维。

## 本书特点

**第一，两个完整可跑的企业级案例。** 卷四交付实验室信息管理系统（认证/流程/报告）和 SaaS 身份平台（多租户/RBAC/SSO）两个真实项目，配套两个 tag 过的可跑代码仓（见下文「配套案例仓库」）。

**第二，决策框架驱动。** 每个技术选型都给「什么时候用 / 为什么」的判断标准——ref vs reactive vs Pinia、Options API vs Composition API、Provide/Inject vs Pinia，不是死记最佳实践。

**第三，Vue 3.5 + TypeScript 全覆盖。** 响应式系统重写、`<script setup>` 编译器宏、自定义指令、Composition API 模式等核心能力都有专题讲解。

**第四，反例驱动教学。** 基础部分先展示错误写法、再讲透为什么错，帮助读者建立工程直觉。

## 谁应该读这本书

如果你有少量 JavaScript 经验，希望系统掌握 Vue 3.5 并最终能独立交付企业级前端项目，这本书适合你。你可能是：

- 在互联网公司工作的前端工程师，希望建立完整的 Vue 3.5 + TypeScript 知识体系
- 独立开发者或小团队成员，需要一个人完成从前端到部署的全流程
- 从 React / jQuery / Vue 2 迁移过来的转型工程师

## 代码清单说明

本目录包含从书籍章节中提取的 **413** 个代码片段文件，涵盖 Vue 3.5 + TypeScript 全栈开发核心知识点。

### 📊 代码统计

- **总块数**: 413 个
- **涉及章节**: 第 1-42 章（卷一至卷四）

### 📋 按编程语言分类

| 语言 | 块数 | 说明 |
|------|------|------|
| vue | 203 | 单文件组件 |
| typescript | 175 | 类型定义 + 脚本 |
| bash | 9 | 命令/脚本 |
| javascript | 7 | JS 示例 |
| ini | 5 | 环境变量配置 |
| json | 3 | 配置文件 |
| nginx | 3 | Nginx 配置 |
| ts | 2 | 类型定义 |
| css | 2 | 样式 |
| yaml | 2 | CI/配置 |
| html | 1 | HTML |
| dockerfile | 1 | Docker |

### 📂 章节覆盖

- **第 1-9 章**: 基础篇——Vue 心智模型、模板语法、响应式、列表渲染
- **第 10-18 章**: 进阶篇——组件化、Props/事件、插槽、Provide/Inject
- **第 19-28 章**: 综合能力篇——Pinia、路由、测试、性能优化
- **第 29-42 章**: 项目实战篇——两个企业级案例（lab-vue + saas-identity-platform-vue）

### 🗂️ 配套案例仓库

本书两个配套案例均为**独立可运行**的完整项目，代码即书正文对应的真实实现（已 tag、全量测试真绿，clone 即跑）：

| 案例 | 技术栈 | 仓库地址 |
|------|--------|---------|
| lab-management-system-vue | Vue 3.5 + Pinia + Element Plus + Vite 6 + TypeScript | `code/cases/lab-management-system-vue/` |
| saas-identity-platform-vue | Vue 3.5 + Pinia + 多租户 + Vite 6 + TypeScript | `code/cases/saas-identity-platform-vue/` |

本目录（vue-book）是**章节代码摘录的索引**；上面的案例仓才是**完整可跑工程**。读者想看真实实现请去案例仓。

## 如何使用代码

每个代码文件都是从对应章节提取的代码片段，文件名格式为 `代码清单{章号}-{序号}_{描述}.{扩展名}`。

## 重新生成 src/

```bash
python .claude/scripts/extract_code.py output/xr-know-011
```

## 配套资源

- **读者交流**: 1282301776@qq.com

## ⚠️ 注意事项

1. **代码版本**: 基于 Vue 3.5.x，API 可能随版本更新
2. **依赖安装**: 完整项目运行请参考各案例仓库的 README
3. **安全审查**: 生产环境使用前请审查代码，特别是认证和权限部分

---

**最后更新**: 2026年07月17日
**书籍版本**: Vue 3.5 + TypeScript
**代码来源**: [../../output/xr-know-011/chapters](../../output/xr-know-011/chapters)
