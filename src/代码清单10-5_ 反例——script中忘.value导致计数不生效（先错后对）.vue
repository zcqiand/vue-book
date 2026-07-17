<script setup lang="ts">
import { ref } from 'vue'

const count = ref<number>(0)

// ❶ 错误写法：在 setup 中直接 count++
// 现象：点击按钮后页面计数不变。原因：count 是 Ref 对象，
// count++ 等价于 count = count + 1，试图把整个 Ref 对象替换成数字，
// 既不会更新 .value，TS 在严格模式下也会报类型错误。
function brokenIncrement(): void {
  // count++ // ← 错误！TS 报错：不能把 Ref<number> 当作 number 自增
  // 即使绕过类型检查强行运行，UI 也不会更新
  void count
}

// ❷ 正确写法：通过 .value 访问内部值
// 只有走 .value，才会触发 ref 的依赖收集与更新派发
function correctIncrement(): void {
  count.value++
}
</script>

<template>
  <div>
    <p>当前计数：{{ count }}</p>
    <button @click="brokenIncrement">错误写法（点了不变）</button>
    <button @click="correctIncrement">正确写法（.value++）</button>
    <!-- 注意：模板里写 count++ 是对的，因为模板自动解包后 count 就是 number -->
    <button @click="count++">模板内联加 1（正确）</button>
  </div>
</template>