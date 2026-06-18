<script setup lang="ts">
import { ref, onMounted } from 'vue'

const name = ref<string>('Vue')

onMounted(() => {
  const container = document.getElementById('box')
  if (container) {
    // 错误写法：把 {{ name }} 当成普通字符串拼接
    container.innerHTML = '<div>{{ name }}</div>'
    // ❶ 页面上原样显示字面量 {{ name }}，name 的值没有被替换
    // 原因：innerHTML 是浏览器原生 API，Vue 编译器不会处理它的字符串
  }
})
</script>

<template>
  <div id="box"></div>
  <!-- 对比：写在 template 里才会被正确编译 -->
  <div>{{ name }}</div>
  <!-- ❷ 这里会渲染出 Vue -->
</template>