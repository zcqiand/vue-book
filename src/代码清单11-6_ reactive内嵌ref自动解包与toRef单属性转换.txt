<script setup lang="ts">
import { reactive, ref, toRef } from 'vue'

// reactive 内嵌 ref：访问 state.count 时 Vue 自动解包
// state.count 是 number（自动解包后的值），不是 Ref<number>
const state = reactive({
  count: ref<number>(0),
  label: '计数器',
})

// 自动解包演示：state.count 直接是数字，无需 .value
function increment(): void {
  state.count++
  // 如果 state.count 是 Ref，这里 ++ 会报错——但实际是自动解包的 number
}

function logCountType(): void {
  // 控制台输出 number，而不是 Ref object
  // 因为 reactive 在内部检测到属性是 ref，自动做了解包
  console.log(typeof state.count, state.count)
}

// toRef：把 reactive 的单个属性提取为独立 ref
// nameRef.value 与 state.name 共享同一个响应式连接
const profile = reactive({
  name: '张三',
  city: '北京',
})

const nameRef = toRef(profile, 'name')
const cityRef = toRef(profile, 'city')

function rename(newName: string): void {
  // 通过 toRef 拿到的 ref 修改，原始 reactive 同步更新
  nameRef.value = newName
}

function relocate(newCity: string): void {
  cityRef.value = newCity
}
</script>

<template>
  <div>
    <h3>reactive 内嵌 ref（自动解包）</h3>
    <p>{{ state.label }}：{{ state.count }}</p>
    <button @click="increment">加 1</button>
    <button @click="logCountType">打印类型到控制台</button>

    <h3>toRef 单属性转换</h3>
    <p>姓名：{{ nameRef }}（来自 toRef）</p>
    <p>城市：{{ cityRef }}（来自 toRef）</p>
    <button @click="rename('李四')">改名</button>
    <button @click="relocate('上海')">搬家</button>
  </div>
</template>