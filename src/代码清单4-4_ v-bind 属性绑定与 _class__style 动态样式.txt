<template>
  <!-- 基础属性绑定：v-bind 简写为冒号 -->
  <a :href="link.url" :target="link.target">{{ link.text }}</a>

  <!-- :class 对象写法：键是类名，值为 true 时生效 -->
  <div :class="{ active: isActive, disabled: !isEnabled }">状态容器</div>

  <!-- :class 数组写法：合并多个类名 -->
  <button :class="['btn', isActive ? 'btn-primary' : 'btn-default']">
    按钮
  </button>

  <!-- :style 对象写法：键名用驼峰或短横线均可（短横线需加引号） -->
  <p :style="{ color: themeColor, fontSize: '14px' }">驼峰键名</p>
  <p :style="{ color: themeColor, 'font-size': '14px' }">短横线键名（必须加引号）</p>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const link = reactive({
  url: 'https://vuejs.org',
  target: '_blank',
  text: 'Vue 官网',
})

const isActive = ref<boolean>(true)
const isEnabled = ref<boolean>(false)
const themeColor = ref<string>('#10b981')
</script>

<style scoped>
.active { background-color: #dbeafe; }
.disabled { opacity: 0.5; }
.btn { padding: 6px 12px; border-radius: 4px; }
.btn-primary { background-color: #3b82f6; color: #fff; }
.btn-default { background-color: #e5e7eb; color: #333; }
</style>