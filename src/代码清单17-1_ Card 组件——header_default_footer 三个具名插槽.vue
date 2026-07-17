<template>
  <div class="card">
    <header class="card-header">
      <slot name="header">
        <span class="default-title">默认标题</span>
      </slot>
    </header>

    <main class="card-body">
      <slot>
        <span class="default-content">默认内容</span>
      </slot>
    </main>

    <footer class="card-footer">
      <slot name="footer">
        <span class="default-footer">默认页脚</span>
      </slot>
    </footer>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  cardTitle?: string
}>()
</script>