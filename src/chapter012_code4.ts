import { ref, computed } from 'vue'

const firstName = ref('张')
const lastName = ref('三')

// computed 版全名
const fullNameComputed = computed(() => {
  console.count('computed 执行')
  return `${firstName.value} ${lastName.value}`
})

// 普通方法版全名
function fullNameMethod() {
  console.count('method 执行')
  return `${firstName.value} ${lastName.value}`
}