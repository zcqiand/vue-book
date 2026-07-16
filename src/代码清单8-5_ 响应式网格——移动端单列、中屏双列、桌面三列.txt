<script setup lang="ts">
const items: string[] = ['模块 A', '模块 B', '模块 C']
</script>

<template>
  <!--
    ❶ grid 开启网格容器
       grid-cols-1 默认一列（手机端）
       md:grid-cols-2 平板及以上两列
       lg:grid-cols-3 桌面及以上三列
       gap-4 单元格间距 16px
       后定义的断点覆盖前面的，按"从小到大"顺序读
  -->
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="rounded-lg bg-white p-4 text-gray-900 shadow-sm dark:bg-gray-800 dark:text-gray-100"
    >
      {{ item }}
    </div>
  </div>
</template>