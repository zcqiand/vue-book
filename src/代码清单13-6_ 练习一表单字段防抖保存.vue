<script setup lang="ts">
import { ref, watch } from 'vue'

const nickname = ref<string>('南荣相如')
const saving = ref<boolean>(false)
const lastSaved = ref<string>('')

watch(nickname, (newVal, _oldVal, onCleanup) => {
  // 字段再次变化，先取消上一次未触发的保存
  onCleanup(() => {
    // 旧的定时器在 cleanup 阶段会被取消
  })

  const timer = setTimeout(() => {
    saving.value = true
    // 真实场景：调用保存接口
    lastSaved.value = newVal
    saving.value = false
    console.log(`已保存昵称：${newVal}`)
  }, 500)

  // 把当前定时器 id 也注册到 cleanup，避免快速输入产生多个延迟任务
  onCleanup(() => clearTimeout(timer))
})

function reset(): void {
  nickname.value = '南荣相如'
}
</script>

<template>
  <div>
    <label>昵称：<input v-model="nickname" /></label>
    <p>保存状态：{{ saving ? '保存中...' : '空闲' }}</p>
    <p>最近保存：{{ lastSaved || '尚未保存' }}</p>
    <button @click="reset">重置</button>
  </div>
</template>