<script setup lang="ts">
import { ref } from 'vue'

// ❶ 折叠面板频繁开合，用 v-show 比 v-if 更划算
const isPanelOpen = ref<boolean>(true)

// 对比组：用 v-if 控制，切换时元素被销毁重建
const isTipVisible = ref<boolean>(true)

let toggleCount = ref<number>(0)

function togglePanel(): void {
  isPanelOpen.value = !isPanelOpen.value
  toggleCount.value++
}
</script>

<template>
  <div class="toggle-demo">
    <button @click="togglePanel">
      {{ isPanelOpen ? '收起' : '展开' }}（已切换 {{ toggleCount }} 次）
    </button>

    <!-- ❷ v-show：元素始终在 DOM 中，只是切换 display 属性 -->
    <div v-show="isPanelOpen" class="panel">
      <p>这是一个用 v-show 控制的折叠面板。</p>
      <p>切换时它不会被销毁，内部输入框的状态得以保留。</p>
      <input type="text" placeholder="在这里输入文字后切换试试" />
    </div>

    <hr />

    <button @click="isTipVisible = !isTipVisible">
      切换提示（用 v-if）
    </button>

    <!-- ❸ v-if：条件为假时元素被完全移除，再切回来时是全新的节点 -->
    <p v-if="isTipVisible" class="tip">这条提示用 v-if 控制，每次切换都会销毁重建。</p>
  </div>
</template>