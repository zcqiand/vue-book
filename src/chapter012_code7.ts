const a = ref(1)
const b = ref(2)

const sum = computed(() => {
  console.log('执行了')
  return a.value + b.value
})