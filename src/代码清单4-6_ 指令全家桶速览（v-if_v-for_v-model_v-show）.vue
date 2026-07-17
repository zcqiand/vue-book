<template>
  <div class="list-demo">
    <!-- v-if：条件为 false 时元素不渲染（不进入 DOM） -->
    <p v-if="isLoggedIn">欢迎回来，{{ userName }}</p>
    <p v-else>请先登录</p>

    <!-- v-show：条件为 false 时元素仍存在 DOM，只是 display:none -->
    <p v-show="showTip">这是一条提示（始终在 DOM 中）</p>

    <!-- v-for：列表渲染，:key 是必须的 -->
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.text }}
      </li>
    </ul>

    <!-- v-model：双向绑定，输入框的值和 inputValue 同步 -->
    <input v-model="inputValue" placeholder="输入内容" />
    <p>你输入了：{{ inputValue }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isLoggedIn = ref<boolean>(true)
const userName = ref<string>('张三')
const showTip = ref<boolean>(false)
const inputValue = ref<string>('')

interface ListItem {
  id: number
  text: string
}
const items = ref<ListItem[]>([
  { id: 1, text: '学习模板语法' },
  { id: 2, text: '编写第一个组件' },
  { id: 3, text: '理解响应式' },
])
</script>