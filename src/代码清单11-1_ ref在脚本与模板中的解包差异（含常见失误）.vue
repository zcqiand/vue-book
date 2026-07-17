<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(0)

// 失误一：console.log 打印 ref 变量，打出的是 Ref 对象本身而非内部值
// 正确做法：console.log(count.value) 才能看到数字 0
function logCurrent(): void {
  // 控制台实际输出：Ref { value: 0 } —— 不是 0，容易误判状态
  console.log(count)
  // 正确写法：console.log(count.value)
}

function increment(): void {
  // 失误二：在脚本里直接 count++（不写 .value）
  // TypeScript 严格模式会直接报错：Cannot assign to 'count' because it is a read-only property
  // 或者绕过类型检查后运行，页面计数根本不变——++操作的是包装对象，不是值
  count.value++ // 正确：必须走 .value
}

function decrement(): void {
  // 另一种失误写法：count = count - 1，试图把整个 Ref 替换成数字
  // TS 报错：Type 'Ref<number>' is not assignable to type 'number'
  count.value--
}
</script>

<template>
  <div>
    <p>当前计数：{{ count }}</p>
    <!-- 模板里 count 已自动解包，所以直接写 count++ 是正确的 -->
    <button @click="count++">模板内联加 1</button>
    <button @click="increment">脚本方法加 1</button>
    <button @click="decrement">脚本方法减 1</button>
    <button @click="logCurrent">打印 count（控制台看差异）</button>
  </div>
</template>