// 拿到 views 下所有页面的懒加载函数（不立即执行 import）
const viewLoaders = import.meta.glob('@/views/*.vue')

// 浏览器空闲时预热用户大概率会去的统计页
function prefetchStats(): void {
  const load = viewLoaders['/src/views/Statistics.vue']
  if (load) {
    // requestIdleCallback 在主线程空闲时执行，不抢占首屏渲染
    requestIdleCallback(() => { void load() })
  }
}

// 首屏渲染完成后再调用，避免和首屏加载抢带宽
prefetchStats()