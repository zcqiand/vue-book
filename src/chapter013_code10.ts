const count = ref(0)

watchEffect(() => {
  count.value++
})