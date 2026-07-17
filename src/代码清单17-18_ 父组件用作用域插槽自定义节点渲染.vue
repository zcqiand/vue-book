<script setup lang="ts">
import { ref } from 'vue'
import TreeNode from './TreeNode.vue'

interface TreeNodeData {
  id: string | number
  label: string
  children?: TreeNodeData[]
}

const tree = ref<TreeNodeData>({
  id: 'root',
  label: '根目录',
  children: [
    {
      id: 'docs',
      label: '文档',
      children: [
        { id: 'doc1', label: '需求文档.md' },
        { id: 'doc2', label: '设计文档.md' },
      ],
    },
    {
      id: 'src',
      label: '源码',
      children: [
        { id: 'main', label: 'main.ts' },
        { id: 'app', label: 'App.vue' },
      ],
    },
    { id: 'readme', label: 'README.md' },
  ],
})
</script>

<template>
  <div class="tree-demo">
    <TreeNode :node="tree">
      <template #default="{ node, level }">
        <span :class="['tree-label', `level-${level}`]">
          {{ node.label }}
        </span>
      </template>
    </TreeNode>
  </div>
</template>