<script setup lang="ts">
// SSR 时服务端请求，客户端直接用 payload，不重复请求
const { data: posts } = await useFetch('/api/posts')
</script>