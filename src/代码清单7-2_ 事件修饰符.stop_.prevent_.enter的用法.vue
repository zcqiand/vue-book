<script setup lang="ts">
import { ref } from 'vue'

const keyword = ref<string>('')

// ❶ 用修饰符后，方法里不必再写 e.stopPropagation() 或 e.preventDefault()
function onSearch(): void {
  console.log('回车触发搜索：', keyword.value)
}

function onSubmit(): void {
  // .prevent 已经在模板里阻止了表单默认提交，这里只管业务逻辑
  console.log('表单提交：', keyword.value)
}

function onOuterClick(): void {
  console.log('外层被点击（仅当没有点在内层时触发）')
}

function onInnerClick(): void {
  console.log('内层被点击，.stop 阻止了冒泡，外层不会触发')
}
</script>

<template>
  <!-- ❷ .stop 阻止事件冒泡到父元素 -->
  <div @click="onOuterClick">
    <button @click.stop="onInnerClick">点我（不会冒泡到外层）</button>
  </div>

  <!-- ❸ .prevent 阻止表单默认提交导致的页面刷新 -->
  <form @submit.prevent="onSubmit">
    <!-- ❹ .enter 监听回车键，按下回车即触发搜索 -->
    <input v-model="keyword" @keyup.enter="onSearch" placeholder="按回车搜索" />
    <button type="submit">提交</button>
  </form>
</template>