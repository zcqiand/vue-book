<script setup lang="ts">
import { ref } from 'vue'
import { useDebounceFn } from '../composables/useDebounceFn'

const keyword = ref<string>('')

const debouncedSearch = useDebounceFn((kw: string) => {
  console.log('实际搜索：', kw)
}, 300)

function onInput(value: string): void {
  keyword.value = value
  debouncedSearch(value) // 300ms 内重复调用只执行最后一次
}
</script>