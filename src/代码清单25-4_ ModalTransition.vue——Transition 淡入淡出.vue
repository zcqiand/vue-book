<script setup lang="ts">
import { ref } from 'vue'

const show = ref<boolean>(false)
</script>

<template>
  <div class="demo">
    <button @click="show = !show">
      {{ show ? '关闭' : '打开' }}模态框
    </button>

    <Transition name="fade">
      <div v-if="show" class="modal">
        <p>模态框内容</p>
        <button @click="show = false">关闭</button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.15);
  z-index: 1000;
}

/* Transition CSS 类名 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.95);
}
</style>