<script setup lang="ts">
import { computed, ref } from 'vue'

interface Message {
  id: number
  content: string
  createdAt: string
}

// ❶ 留言内容用 v-model.lazy，失焦才同步；字数计数器用 @input 单独驱动
const draft = ref<string>('')
const liveLength = ref<number>(0)

const messages = ref<Message[]>([])
let nextId = 1

const isOverLimit = computed<boolean>(() => liveLength.value > 200)
const isEmpty = computed<boolean>(() => draft.value.trim().length === 0)
const canSubmit = computed<boolean>(
  () => !isEmpty.value && !isOverLimit.value
)

function onLiveInput(e: Event): void {
  // ❷ 实时字数：每次 input 都触发，与 v-model.lazy 互不干扰
  liveLength.value = (e.target as HTMLTextAreaElement).value.length
}

function clearDraft(): void {
  // ❸ 清空前确认，避免误操作
  if (!confirm('确认清空当前编辑的留言？')) return
  draft.value = ''
  liveLength.value = 0
}

function submit(): void {
  if (!canSubmit.value) return
  messages.value.push({
    id: nextId++,
    content: draft.value.trim(),
    createdAt: new Date().toLocaleString(),
  })
  draft.value = ''
  liveLength.value = 0
}
</script>

<template>
  <div style="max-width: 480px">
    <h3>留言板</h3>

    <textarea
      v-model.lazy="draft"
      rows="5"
      placeholder="说点什么..."
      :style="{ borderColor: isOverLimit ? 'red' : '#ccc' }"
      @input="onLiveInput"
    ></textarea>

    <p :style="{ color: isOverLimit ? 'red' : '#666' }">
      字数：{{ liveLength }} / 200{{ isOverLimit ? '（超出上限）' : '' }}
    </p>

    <button type="button" @click="clearDraft">清空</button>
    <button type="button" :disabled="!canSubmit" @click="submit">提交</button>

    <h4>历史留言</h4>
    <ul>
      <li v-for="msg in messages" :key="msg.id">
        <small>{{ msg.createdAt }}</small> — {{ msg.content }}
      </li>
    </ul>
  </div>
</template>