<script setup lang="ts">
import { inject } from 'vue'
import type { InjectionKey } from 'vue'

interface AppConfig {
  appName: string
  year: number
}

const configKey: InjectionKey<AppConfig> = Symbol('config')
const config = inject(configKey)
</script>

<template>
  <footer v-if="config" class="footer">
    © {{ config.year }} {{ config.appName }}
  </footer>
</template>