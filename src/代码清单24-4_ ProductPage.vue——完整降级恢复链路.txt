<script setup lang="ts">
import { ref } from 'vue'
import ErrorBoundary from './ErrorBoundary.vue'

const showRetryHint = ref<boolean>(false)

function handleRetry(): void {
  showRetryHint.value = false
  // 重新触发 Suspense 重新加载
  window.location.reload()
}
</script>

<template>
  <div class="product-page">
    <ErrorBoundary>
      <Suspense>
        <template #default>
          <ProductDetail />
        </template>
        <template #fallback>
          <div class="loading-skeleton">
            <div class="skeleton-title"></div>
            <div class="skeleton-content"></div>
          </div>
        </template>
        <template #error>
          <div class="error-fallback">
            <h3>无法加载商品详情</h3>
            <p>网络或服务端出现问题</p>
            <button @click="handleRetry">重新加载</button>
          </div>
        </template>
      </Suspense>
    </ErrorBoundary>
  </div>
</template>