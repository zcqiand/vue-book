<script setup lang="ts">
const { data } = await useAsyncData('user-profile', async () => {
  const res = await $fetch<User>('/api/user/me', {
    headers: useRequestHeaders(['cookie']),
  })
  return res
})
</script>