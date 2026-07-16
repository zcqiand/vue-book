<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface Message {
  id: number
  sender: string
  content: string
  timestamp: string
}

const messages = ref<Message[]>([
  { id: 1, sender: 'Alice', content: '你好！', timestamp: '10:00' },
  { id: 2, sender: 'Bob', content: '嗨，今天怎么样？', timestamp: '10:01' },
])

const newMessage = ref<string>('')
const messageListEl = ref<HTMLDivElement | null>(null)
const lastMsgId = ref<number>(2)

function formatTime(): string {
  const now = new Date()
  return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
}

async function sendMessage(): Promise<void> {
  if (!newMessage.value.trim()) return

  const msg: Message = {
    id: lastMsgId.value + 1,
    sender: 'Me',
    content: newMessage.value.trim(),
    timestamp: formatTime(),
  }

  // 1. 先更新响应式数据
  messages.value.push(msg)
  lastMsgId.value = msg.id
  newMessage.value = ''

  // 2. 等待 DOM 更新完成后再执行滚动
  // 如果不加 nextTick，scrollTop 可能滚到的是旧高度（因为 DOM 还没更新完）
  await nextTick()
  console.log('[ChatRoom] DOM 已更新，执行滚动到底部')

  if (messageListEl.value) {
    messageListEl.value.scrollTop = messageListEl.value.scrollHeight
  }
}
</script>

<template>
  <div>
    <h3>聊天室</h3>

    <div
      ref="messageListEl"
      style="height: 200px; overflow-y: auto; border: 1px solid #ccc; padding: 8px"
    >
      <div v-if="messages.length === 0" style="color: #999">暂无消息</div>
      <div
        v-for="msg in messages"
        :key="msg.id"
        :style="{
          textAlign: msg.sender === 'Me' ? 'right' : 'left',
          margin: '8px 0',
        }"
      >
        <span
          :style="{
            display: 'inline-block',
            padding: '6px 10px',
            borderRadius: '8px',
            background: msg.sender === 'Me' ? '#4caf50' : '#e0e0e0',
            color: msg.sender === 'Me' ? '#fff' : '#000',
          }"
        >
          <strong>{{ msg.sender }}:</strong> {{ msg.content }}
          <small style="opacity: 0.7; margin-left: 4px">{{ msg.timestamp }}</small>
        </span>
      </div>
    </div>

    <div style="margin-top: 8px">
      <input
        v-model="newMessage"
        type="text"
        placeholder="输入消息..."
        style="padding: 8px; width: 300px"
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage" style="padding: 8px 16px; margin-left: 8px">发送</button>
    </div>

    <p>发送消息后，列表自动滚动到底部，无需手动操作滚动条</p>
  </div>
</template>