<template>
  <div class="counter">
    <p>当前计数：{{ count }}</p>

    <!-- @click 绑定点击事件，简写形式 -->
    <button @click="increment">+1</button>

    <!-- 内联表达式：直接改 ref 值，模板里自动解包无需 .value -->
    <button @click="count = 0">重置</button>

    <!-- 事件修饰符：.prevent 阻止默认行为（如链接跳转） -->
    <a href="https://example.com" @click.prevent="onLinkClick">点我不跳转</a>

    <!-- 按键修饰符：只在按下 Enter 时触发 -->
    <input
      :value="inputValue"
      placeholder="按回车提交"
      @keydown.enter="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(0)
const inputValue = ref<string>('')

function increment(): void {
  count.value++ // script 内修改 ref 必须用 .value
}

function onLinkClick(): void {
  console.log('链接被点击，但默认跳转已被 .prevent 阻止')
}

function onSubmit(): void {
  console.log('提交内容：', inputValue.value)
}
</script>