<template>
  <slot :x="x" :y="y" />
</template>

<script setup lang="ts">
import { useMousePosition } from '../composables/useMousePosition'

const { x, y } = useMousePosition()
</script>