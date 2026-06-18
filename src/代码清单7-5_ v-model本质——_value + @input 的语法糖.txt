<script setup lang="ts">
import { ref } from 'vue'

const textA = ref<string>('')
const textB = ref<string>('')

// ❶ 手动版需要这个处理函数：从事件对象取出输入值再赋给 ref
function onInput(e: Event): void {
  textA.value = (e.target as HTMLInputElement).value
}
</script>

<template>
  <div>
    <h3>手动双向绑定（啰嗦写法）</h3>
    <!-- ❷ :value 绑定值，@input 监听输入事件更新值 -->
    <input :value="textA" @input="onInput" placeholder="手动版" />
    <p>值：{{ textA }}</p>
  </div>

  <div>
    <h3>v-model 一步简化</h3>
    <!-- ❸ v-model 等价于上面 :value + @input 两行的语法糖 -->
    <input v-model="textB" placeholder="v-model 版" />
    <p>值：{{ textB }}</p>
  </div>
</template>