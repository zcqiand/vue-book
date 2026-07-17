<script setup lang="ts">
import { ref } from 'vue'

const show = ref<boolean>(false)
</script>

<template>
  <div class="demo">
    <button @click="show = !show">打开模态框</button>

    <!-- Teleport 将内容传送到 body，脱离父级层叠上下文 -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="show" class="modal-overlay" @click.self="show = false">
          <div class="modal-content">
            <h3>模态框标题</h3>
            <p>模态框内容区域</p>
            <button @click="show = false">关闭</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 300px;
}
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>