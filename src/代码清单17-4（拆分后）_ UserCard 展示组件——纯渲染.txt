<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" class="avatar" />
    <div class="user-info">
      <h3>{{ user.name }}</h3>
      <p>{{ user.role }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  user: { id: number; name: string; role: string; avatar: string }
}>()
</script>