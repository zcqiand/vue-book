<script setup lang="ts">
import { ref } from 'vue'

// ❶ .lazy：默认随 input 实时变，加了 .lazy 后只在 change（失焦/回车）时更新
const lazyText = ref<string>('')

// ❷ .number：输入自动转为 number 类型，无法转换时保留原字符串
const age = ref<number | ''>('')

// ❸ .trim：自动去除首尾空白字符
const email = ref<string>('')
</script>

<template>
  <div>
    <label>.lazy（失焦后才同步）</label>
    <input v-model.lazy="lazyText" placeholder="输入后点击别处看变化" />
    <p>当前值：{{ lazyText }}</p>
  </div>

  <div>
    <label>.number（自动转数字）</label>
    <input v-model.number="age" type="text" placeholder="输入年龄" />
    <p>当前值：{{ age }}，类型：{{ typeof age }}</p>
  </div>

  <div>
    <label>.trim（去除首尾空格）</label>
    <input v-model.trim="email" type="text" placeholder="输入邮箱" />
    <p>当前值：[{{ email }}]</p>
  </div>
</template>