<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import ErrorBoundary from './ErrorBoundary.vue'

const ProductDetail = defineAsyncComponent({
  loader: () => import('./ProductDetail.vue'),
  loadingComponent: {
    template: '<div class="loading">加载中...</div>',
  },
  errorComponent: {
    template: '<div class="async-error">异步加载失败</div>',
  },
  timeout: 5000,
})
</script>

<template>
  <ErrorBoundary>
    <Suspense>
      <template #default>
        <ProductDetail />
      </template>
      <template #fallback>
        <div class="skeleton">
          <div class="skeleton-line" style="width: 60%"></div>
          <div class="skeleton-line" style="width: 80%"></div>
        </div>
      </template>
      <template #error>
        <div class="async-error-boundary">
          <p>数据加载失败，请稍后重试</p>
          <button @click="$router.go(0)">重新加载页面</button>
        </div>
      </template>
    </Suspense>
  </ErrorBoundary>
</template>