<script setup lang="ts">
import { reactive } from 'vue'

interface User {
  name: string
  age: number
}

interface Todo {
  id: number
  text: string
  done: boolean
}

// reactive 接收一个对象字面量，TS 会自动推断其类型
const state = reactive<{ user: User; todos: Todo[] }>({
  user: { name: '张三', age: 28 },
  todos: [],
})

let nextId = 1

function rename(): void {
  // 直接改对象属性即可触发响应式更新，无需展开运算符创建新对象
  state.user.name = '李四'
}

function addTodo(text: string): void {
  // 数组 push 同样是响应式的：reactive 代理了数组的变更方法
  state.todos.push({ id: nextId++, text, done: false })
}

function complete(id: number): void {
  // 修改数组元素的对象属性，深层响应式同样捕获
  const target = state.todos.find((item) => item.id === id)
  if (target) {
    target.done = true
  }
}

addTodo('学完 ref 与 reactive')
addTodo('完成本章练习')
</script>

<template>
  <div>
    <p>姓名：{{ state.user.name }}（{{ state.user.age }} 岁）</p>
    <button @click="rename">改名为李四</button>

    <ul>
      <li v-for="item in state.todos" :key="item.id">
        <span :style="{ textDecoration: item.done ? 'line-through' : 'none' }">
          {{ item.text }}
        </span>
        <button @click="complete(item.id)" :disabled="item.done">完成</button>
      </li>
    </ul>
  </div>
</template>