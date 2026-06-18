<template>
  <!-- 管道符 | 把 price 的值传给 currency filter，结果替换原位 -->
  <p>单价：{{ price | currency }}</p>
  <p>总价：{{ quantity * price | currency }}</p>
</template>

<script>
export default {
  data() {
    return {
      price: 12.5,
      quantity: 3
    }
  },
  // filter 注册在组件选项里，仅模板可用，无法被其他组件或 JS 复用
  filters: {
    currency(value) {
      // filter 接收的是管道符左侧表达式的值，不校验类型容易在 null 上炸
      if (typeof value !== 'number') return '¥0.00'
      return '¥' + value.toFixed(2)
    }
  }
}
</script>