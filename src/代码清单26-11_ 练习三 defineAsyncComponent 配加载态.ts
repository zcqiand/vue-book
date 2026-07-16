import { defineAsyncComponent } from 'vue'
import ChartSkeleton from '@/components/ChartSkeleton.vue'
import ChartError from '@/components/ChartError.vue'

// 把重量级图表面板拆成异步组件
export const ChartPanel = defineAsyncComponent({
  loader: () => import('@/components/ChartPanel.vue'),
  loadingComponent: ChartSkeleton, // chunk 加载中显示骨架屏
  errorComponent: ChartError,       // 加载失败显示重试提示
  delay: 200,                       // 200ms 内加载完成则不闪骨架屏
  timeout: 8000,                    // 超过 8 秒判定为失败
})