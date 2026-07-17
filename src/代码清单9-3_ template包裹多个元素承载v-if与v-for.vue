<script setup lang="ts">
import { ref } from 'vue'

interface FaqItem {
  id: number
  term: string
  desc: string
}

const showFaq = ref<boolean>(true)

// ❶ 定义术语表，每个项含唯一 id 和一组 term/desc
const faqList = ref<FaqItem[]>([
  { id: 1, term: 'v-if', desc: '根据条件真假销毁或重建元素' },
  { id: 2, term: 'v-show', desc: '通过 display 切换显隐，元素始终存在' },
  { id: 3, term: ':key', desc: '列表项的唯一身份标识，帮助 Vue 复用节点' },
])
</script>

<template>
  <div class="faq">
    <button @click="showFaq = !showFaq">{{ showFaq ? '隐藏' : '显示' }}术语表</button>

    <!-- ❷ template + v-if 包裹多个元素，不产生多余 DOM 节点 -->
    <dl v-if="showFaq">
      <!-- ❸ template + v-for 遍历，每个项渲染出 dt 和 dd 两个节点，:key 写在 template 上 -->
      <template v-for="item in faqList" :key="item.id">
        <dt>{{ item.term }}</dt>
        <dd>{{ item.desc }}</dd>
      </template>
    </dl>
  </div>
</template>