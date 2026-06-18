import { markRaw } from 'vue'

// 模拟第三方地图类（真实场景如 Google Maps API 实例、Leaflet 地图等）
class ThirdPartyMap {
  private markers: Map<string, google.maps.Marker> = new Map()

  addMarker(id: string, lat: number, lng: number): void {
    // 每次添加标记时，第三方库内部会维护状态
    // 如果没有 markRaw，Vue 会尝试追踪这个 markers Map 的变化
    // 大量标记操作时，Proxy 拦截会显著拖慢性能
    console.log(`[Map] 添加标记 ${id} at (${lat}, ${lng})`)
  }

  removeMarker(id: string): void {
    this.markers.delete(id)
  }

  setCenter(lat: number, lng: number): void {
    // 地图平移、缩放都会触发内部状态更新
    // 这些高频事件如果被 Vue 追踪，每次都会触发依赖收集
    console.log(`[Map] 设置中心点 (${lat}, ${lng})`)
  }

  getBounds(): string {
    return 'bounds_data'
  }
}

// 错误写法（注释掉）：
// const map = new ThirdPartyMap()  // 没有 markRaw，Vue 会给 map 添加 Proxy 代理

// 正确写法：markRaw 标记后，Vue 完全不追踪 map 实例内部状态
const map = markRaw(new ThirdPartyMap())

// 使用示例
map.addMarker('user-1', 39.9042, 116.4074)  // 无需 Vue 追踪，高性能
map.addMarker('user-2', 39.9142, 116.4174)
map.setCenter(39.9092, 116.4114)

// 重要：markRaw 后不要再对 map 做响应式转换
// 错误：const mapState = reactive({ mapInstance: map })  // 会绕过 markRaw
// 正确：如果需要把 map 放进状态，用 shallowReactive 组合
import { shallowReactive } from 'vue'
const mapState = shallowReactive({
  mapInstance: map,        // map 已经是 markRaw 的，shallowReactive 不追踪其内部
  selectedMarkerId: null as string | null,  // 这个变化会触发更新
})