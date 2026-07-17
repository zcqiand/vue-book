<template>
  <!-- Vue 2 模板里通过 this.$store 直接拿到 store 实例 -->
  <div>
    <p>当前计数：{{ $store.state.count }}</p>
    <button @click="$store.commit('increment')">+1</button>
    <button @click="$store.dispatch('incrementAsync', { delay: 500 })">
      异步 +1
    </button>
  </div>
</template>

<script>
export default {
  name: 'Counter'
}
</script>