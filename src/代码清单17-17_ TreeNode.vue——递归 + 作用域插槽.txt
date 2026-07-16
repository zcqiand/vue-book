<template>
  <div class="tree-node" :class="{ 'is-leaf': !hasChildren, 'is-disabled': node.disabled }">
    <div class="tree-node-row" :style="{ paddingLeft: `${(level ?? 0) * 16 + 8}px` }">
      <button
        v-if="hasChildren"
        class="toggle-btn"
        :aria-expanded="expanded"
        @click="toggle"
      >
        {{ expanded ? '▼' : '▶' }}
      </button>
      <span v-else class="toggle-placeholder" />

      <slot :node="node" :level="level ?? 0" :expanded="expanded">
        <span>{{ node.label }}</span>
      </slot>
    </div>

    <div v-if="hasChildren && expanded" class="tree-node-children">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="(level ?? 0) + 1"
      >
        <template #default="slotProps">
          <slot v-bind="slotProps" />
        </template>
      </TreeNode>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface TreeNodeData {
  id: string | number
  label: string
  children?: TreeNodeData[]
  disabled?: boolean
}

interface Props {
  node: TreeNodeData
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  level: 0,
})

defineOptions({ name: 'TreeNode' })

const expanded = ref<boolean>(props.level < 2)
const hasChildren = computed<boolean>(
  () => Array.isArray(props.node.children) && props.node.children.length > 0
)

function toggle(): void {
  expanded.value = !expanded.value
}
</script>