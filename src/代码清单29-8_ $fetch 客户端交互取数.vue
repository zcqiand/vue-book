<script setup lang="ts">
async function refresh() {
  const res = await $fetch('/api/articles', { query: { page: 2 } })
  articles.value = res
}
</script>