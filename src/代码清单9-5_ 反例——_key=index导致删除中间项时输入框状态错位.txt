<script setup lang="ts">
import { ref } from 'vue'

interface Task {
  id: number
  text: string
}

const nextId = ref<number>(4)

// ❶ 三个任务，每个带唯一 id，但模板里不用它做 key，故意用 index
const tasks = ref<Task[]>([
  { id: 1, text: '任务一' },
  { id: 2, text: '任务二' },
  { id: 3, text: '任务三' },
])

// ❷ 按 id 删除任务（删除逻辑本身没问题，问题在模板的 key）
function removeTask(taskId: number): void {
  tasks.value = tasks.value.filter(task => task.id !== taskId)
}
</script>

<template>
  <div class="bad-key-demo">
    <h2>反例：用 index 作为 :key</h2>
    <p>在三个输入框里分别输入 A、B、C，然后点击第一项的"删除"——观察输入框文字如何错位。</p>

    <ul>
      <!-- ❸ 故意用 :key="index"，这是 bug 根源 -->
      <li v-for="(task, index) in tasks" :key="index">
        <span>{{ task.text }}</span>
        <!-- ❹ 这个输入框是"非受控"的，它的内容由 DOM 自身维护 -->
        <input type="text" placeholder="输入文字" />
        <button @click="removeTask(task.id)">删除</button>
      </li>
    </ul>
  </div>
</template>