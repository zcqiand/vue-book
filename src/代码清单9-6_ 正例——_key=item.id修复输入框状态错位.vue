<script setup lang="ts">
import { ref } from 'vue'

interface Task {
  id: number
  text: string
}

const tasks = ref<Task[]>([
  { id: 1, text: '任务一' },
  { id: 2, text: '任务二' },
  { id: 3, text: '任务三' },
])

function removeTask(taskId: number): void {
  tasks.value = tasks.value.filter(task => task.id !== taskId)
}
</script>

<template>
  <div class="good-key-demo">
    <h2>正例：用 task.id 作为 :key</h2>
    <p>同样在输入框输入 A、B、C 后删除第一项——这次输入框文字会跟着对应任务一起消失，不再错位。</p>

    <ul>
      <!-- ❶ :key 改为 task.id，Vue 按"数据身份"而非"位置"复用节点 -->
      <li v-for="task in tasks" :key="task.id">
        <span>{{ task.text }}</span>
        <input type="text" placeholder="输入文字" />
        <button @click="removeTask(task.id)">删除</button>
      </li>
    </ul>
  </div>
</template>