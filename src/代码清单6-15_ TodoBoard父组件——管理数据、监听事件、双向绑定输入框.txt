<script setup lang="ts">
import { ref } from 'vue'
import TodoItem from '@/components/TodoItem.vue'

interface Todo {
  id: number
  text: string
  completed: boolean
}

const todos = ref<Todo[]>([
  { id: 1, text: '学习 defineProps 传值', completed: false },
  { id: 2, text: '练习 defineEmits 通信', completed: false },
])

const draft = ref('') // 新增输入框的值，用 v-model 双向绑定

// 监听子组件 toggle 事件，按 id 更新对应条目
function onToggle(id: number, nextCompleted: boolean) {
  todos.value = todos.value.map((todo) =>
    todo.id === id ? { ...todo, completed: nextCompleted } : todo,
  )
}

function addTodo() {
  const text = draft.value.trim()
  if (text === '') return

  todos.value.push({ id: Date.now(), text, completed: false })
  draft.value = '' // 清空输入框
}
</script>

<template>
  <div class="todo-board">
    <h2>待办事项</h2>
    <ul>
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :text="todo.text"
        :completed="todo.completed"
        @toggle="(next) => onToggle(todo.id, next)"
      />
    </ul>
    <div>
      <!-- draft 用 v-model 与输入框双向绑定 -->
      <input v-model="draft" type="text" placeholder="输入新的待办" />
      <button type="button" @click="addTodo">添加</button>
    </div>
  </div>
</template>

<style scoped>
.todo-board {
  max-width: 480px;
  margin: 0 auto;
}
</style>