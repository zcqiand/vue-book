import { computed, ref, type CSSProperties, type Ref } from 'vue'

export interface VirtualItem<T> {
  item: T
  index: number
  top: number
}

export function useVirtualList<T>(
  items: Ref<T[]>,
  options: {
    itemHeight: number
    containerHeight: number
    overscan?: number
  }
) {
  const scrollTop = ref(0)
  const overscan = options.overscan ?? 4

  const totalHeight = computed(() => items.value.length * options.itemHeight)

  const startIndex = computed(() => {
    const raw = Math.floor(scrollTop.value / options.itemHeight) - overscan
    return Math.max(0, raw)
  })

  const endIndex = computed(() => {
    const visibleCount = Math.ceil(options.containerHeight / options.itemHeight)
    return Math.min(items.value.length, startIndex.value + visibleCount + overscan * 2)
  })

  const virtualItems = computed<Array<VirtualItem<T>>>(() => {
    return items.value.slice(startIndex.value, endIndex.value).map((item, offset) => {
      const index = startIndex.value + offset
      return { item, index, top: index * options.itemHeight }
    })
  })

  const containerStyle = computed<CSSProperties>(() => ({
    height: `${options.containerHeight}px`,
    overflowY: 'auto',
    position: 'relative'
  }))

  const spacerStyle = computed<CSSProperties>(() => ({
    height: `${totalHeight.value}px`,
    position: 'relative'
  }))

  function onScroll(event: Event): void {
    scrollTop.value = (event.currentTarget as HTMLElement).scrollTop
  }

  return {
    scrollTop,
    totalHeight,
    virtualItems,
    containerStyle,
    spacerStyle,
    onScroll
  }
}