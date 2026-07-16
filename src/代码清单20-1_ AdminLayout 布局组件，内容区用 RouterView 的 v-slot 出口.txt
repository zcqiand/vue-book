<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="admin-layout">
    <header class="topbar">后台管理系统</header>
    <div class="body">
      <aside class="sidebar">
        <RouterLink to="/admin/dashboard">控制台</RouterLink>
        <RouterLink to="/admin/users">用户管理</RouterLink>
        <RouterLink to="/admin/settings">系统设置</RouterLink>
      </aside>
      <main class="content">
        <!-- v-slot 拿到当前匹配的组件，套一层淡入过渡 -->
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>
  </div>
</template>