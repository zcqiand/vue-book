import { useMouse } from '@/composables/useMouse'

// 初始值测试可以通过
const { x, y } = useMouse()
expect(x.value).toBe(0)  // 通过

// 但模拟 mousemove 后 x 没有更新——测试通过了，但 x.value 依然是 0
window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100 }))
expect(x.value).toBe(100)  // ❌ 失败，但没有任何报错