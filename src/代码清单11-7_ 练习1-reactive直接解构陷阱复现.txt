<script setup lang="ts">
import { reactive, toRefs } from 'vue'

interface Roster {
  leader: string
  members: string[]
}

const state = reactive<Roster>({
  leader: '张三',
  members: ['张三', '李四'],
})

// 故意直接解构 —— 这两个变量从此脱离响应式
const { leader, members } = state

// 这一组用 toRefs 修复，可用于对比
const { leader: leaderRef, members: membersRef } = toRefs(state)

function changeLeader(): void {
  state.leader = '李四'
  // 同步替换成员数组里所有出现老负责人的元素
  state.members = state.members.map((name) =>
    name === state.leader ? '李四' : name,
  )
}
</script>

<template>
  <section>
    <h3>reactive 直接解构（响应式丢失）</h3>
    <p>来自 state：{{ state.leader }}</p>
    <p>来自解构：{{ leader }}（失效，不随 state 更新）</p>
    <p>成员：{{ members.join('、') }}</p>

    <h3>toRefs 解构（响应式保持）</h3>
    <p>来自 ref：{{ leaderRef }}</p>
    <p>成员 ref：{{ membersRef.join('、') }}</p>

    <button @click="changeLeader">更换负责人</button>
  </section>
</template>