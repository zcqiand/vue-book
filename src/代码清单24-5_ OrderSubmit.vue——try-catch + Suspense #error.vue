<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'

interface OrderForm {
  productId: string
  quantity: number
}

const form = ref<OrderForm>({ productId: '', quantity: 1 })
const submitError = ref<string>('')
const isSubmitting = ref<boolean>(false)

// 异步组件：模拟 5 秒后抛出加载失败
const OrderDetail = defineAsyncComponent({
  loader: () => import('./OrderDetail.vue'),
  loadingComponent: {
    template: '<div class="loading">加载订单详情...</div>',
  },
  timeout: 5000,
})

async function handleSubmit(): Promise<void> {
  submitError.value = ''
  isSubmitting.value = true
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    })
    if (!response.ok) {
      throw new Error(`提交失败：${response.status} ${response.statusText}`)
    }
    await response.json()
    alert('提交成功')
  } catch (err) {
    // try-catch 接住 await 语句的异步错误
    submitError.value = err instanceof Error ? err.message : '提交失败'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="order-submit">
    <form @submit.prevent="handleSubmit">
      <label>
        商品 ID
        <input v-model="form.productId" type="text" required />
      </label>
      <label>
        数量
        <input v-model.number="form.quantity" type="number" min="1" required />
      </label>
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? '提交中...' : '提交订单' }}
      </button>
      <p v-if="submitError" class="error-msg">{{ submitError }}</p>
    </form>

    <hr />

    <Suspense>
      <template #default>
        <OrderDetail :order-id="form.productId" />
      </template>
      <template #fallback>
        <div class="loading-skeleton">
          <div class="skeleton-line" style="width: 60%"></div>
          <div class="skeleton-line" style="width: 80%"></div>
        </div>
      </template>
      <template #error>
        <div class="async-error-boundary">
          <p>订单详情加载失败，请稍后重试</p>
          <button @click="$router.go(0)">重新加载页面</button>
        </div>
      </template>
    </Suspense>
  </div>
</template>

<style scoped>
.order-submit { padding: 24px; max-width: 480px; }
form { display: flex; flex-direction: column; gap: 12px; }
.error-msg { color: #dc2626; font-size: 14px; }
.loading-skeleton { padding: 16px; }
.skeleton-line {
  height: 16px;
  background: #e5e7eb;
  border-radius: 4px;
  margin-bottom: 8px;
}
.async-error-boundary {
  padding: 16px;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 4px;
}
</style>