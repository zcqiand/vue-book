<script setup lang="ts">
import MouseTracker from './MouseTracker.vue'
</script>

<template>
  <MouseTracker v-slot="{ x, y }">
    <div class="coords-display">
      鼠标位置：{{ x }}, {{ y }}
    </div>
  </MouseTracker>
</template>