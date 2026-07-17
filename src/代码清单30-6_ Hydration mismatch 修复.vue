<script setup lang="ts">
// useId 生成 SSR 安全的唯一 ID，两端结果一致
const id = useId()
const now = useNow() // 自定义 Composable，返回服务端和客户端一致的时间
</script>