<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'

// 主布局（ch34）：顶栏 + 侧边栏 + 内容区（router-view 嵌套出口）。
// 业务页面作为 '/' 路由的 children 挂载，渲染到这里。
</script>

<template>
  <div class="flex h-screen" data-testid="main-layout" data-fn="M01.F04.I02">
    <AppSidebar />
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white border-b px-6 py-3 shadow-sm" data-testid="main-header">
        <h1 class="text-lg font-semibold text-gray-800">建筑工程实验室管理系统</h1>
      </header>
      <main class="flex-1 overflow-auto min-h-0 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>