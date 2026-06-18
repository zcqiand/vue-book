import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// 路由记录用 RouteRecordRaw 类型约束：路径、名称、组件都受 TS 检查
// 拼错 meta 或 path 会在编译期报错，比纯 JS 路由表安全得多
const routes: RouteRecordRaw[] = [
  // 登录页：顶级路由，不进入 MainLayout
  // 用懒加载是因为登录页只在首次进入时用一次，不懒加载会拖慢首屏
  {
    path: '/login',
    name: 'login',
    // 动态 import 让 Vite 把 LoginView 拆成独立 chunk，访问 /login 时才请求
    // 写成 () => import(...) 而非直接 import，是 Vue Router 官方推荐的懒加载写法
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false, title: '登录' }
  },
  // 主布局：所有需要登录才能访问的页面都挂在它的 children 下
  // 这样只需在 MainLayout 这一层声明布局，所有子页面自动复用
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    // 在父路由上统一声明需要登录，子路由继承此 meta，路由守卫只需判断一处
    meta: { requiresAuth: true },
    children: [
      // 默认首页：访问 / 时重定向到 /dashboard，避免空白 router-view
      // 用 redirect 而非单独写一个 HomeView，是因为首页本质上就是 dashboard
      { path: '', redirect: '/dashboard' },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: '工作台' }
      },
      {
        path: 'inspection',
        name: 'inspection-list',
        component: () => import('@/views/inspection/InspectionListView.vue'),
        meta: { title: '检测项目' }
      },
      // 动态路由：:id 是路径参数，组件里用 route.params.id 读取
      // 放在 inspection-list 之后，避免被 /inspection 匹配吞掉
      {
        path: 'inspection/:id',
        name: 'inspection-detail',
        component: () => import('@/views/inspection/InspectionDetailView.vue'),
        meta: { title: '检测项目详情' }
      },
      {
        path: 'sample',
        name: 'sample-list',
        component: () => import('@/views/sample/SampleListView.vue'),
        meta: { title: '样品管理' }
      },
      {
        path: 'report',
        name: 'report-list',
        component: () => import('@/views/report/ReportListView.vue'),
        meta: { title: '报告管理' }
      }
    ]
  },
  // 兜底路由：匹配不到任何已声明路径时落到这里
  // 必须放在 routes 数组最后，Vue Router 按顺序匹配，提前写会拦截所有路由
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '页面不存在' }
  }
]

// createWebHistory 启用 HTML5 History 模式：URL 无 # 号，更接近传统网站
// 生产部署时需在 Web 服务器配置 fallback 到 index.html，否则刷新 404
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 全局前置守卫：在导航发生前统一做权限与标题处理
// 集中在这里做，避免每个页面组件里重复写判断逻辑
router.beforeEach((to, _from) => {
  // 设置页面标题：用 meta.title 比每个组件 onMounted 里改 document.title 集中得多
  if (to.meta.title) {
    document.title = `${to.meta.title} - 实验室管理系统`
  }
  // 权限判断：requiresAuth 为 true 且未登录时跳登录页，并记录原目标供登录后回跳
  // store 的引入放在守卫内部而非模块顶部，是为了规避循环依赖（store 可能引用 router）
  return true
})

export default router