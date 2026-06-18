<!-- 写法一：<script setup>（本书主推）-->
<script setup lang="ts">
import { ref } from 'vue'

const name = ref<string>('Vue') // 顶层声明自动暴露给模板，无需 return
function handleClick(): void {
  name.value = 'clicked'
}
</script>

<!-- 写法二：普通 setup() 函数（旧写法，仅作对比）-->
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const name = ref<string>('Vue')
    function handleClick(): void {
      name.value = 'clicked'
    }
    // 必须手动 return，否则模板找不到 name 和 handleClick，渲染空白
    return { name, handleClick }
  },
})
</script>