<script setup lang="ts">
import { ref } from 'vue'

const mounted = ref<boolean>(false)

setTimeout(() => {
  mounted.value = true
}, 2000)
</script>

<template>
  <div class="deferred-demo">
    <!-- 延迟 2 秒后渲染目标节点 -->
    <div v-if="mounted" id="later-target" class="target-node">
      目标节点（2 秒后出现）
    </div>

    <!-- defer 修饰符让 Teleport 等待目标节点就绪后再传送 -->
    <Teleport defer to="#later-target">
      <div class="teleported-content">
        <p>这个内容会在目标节点出现后自动传送过去</p>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.target-node {
  padding: 12px;
  background: #dbeafe;
  border: 1px solid #3b82f6;
  border-radius: 6px;
  margin-top: 12px;
}
.teleported-content {
  padding: 12px;
  background: #dcfce7;
  border: 1px solid #22c55e;
  border-radius: 6px;
  margin-top: 8px;
}
</style>