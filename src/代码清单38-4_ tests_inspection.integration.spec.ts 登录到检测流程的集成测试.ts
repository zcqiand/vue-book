import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, defineStore } from 'pinia'
import { computed, defineComponent, ref } from 'vue'
import {
  createMemoryHistory,
  createRouter,
  RouterLink,
  RouterView,
  useRouter,
  type RouteRecordRaw,
} from 'vue-router'
import { describe, expect, it } from 'vitest'

type WorkflowStatus = '受理' | '检测中' | '报告生成' | '审核通过' | '驳回' | '撤回'
type WorkflowAction = 'start_inspection' | 'generate_report' | 'approve' | 'reject' | 'withdraw' | 'reopen_inspection'

interface InspectionProject {
  id: number
  name: string
  status: WorkflowStatus
}

const transitionTable: Record<WorkflowStatus, Partial<Record<WorkflowAction, WorkflowStatus>>> = {
  受理: { start_inspection: '检测中', withdraw: '撤回' },
  检测中: { generate_report: '报告生成', reject: '驳回', withdraw: '撤回' },
  报告生成: { approve: '审核通过', reject: '驳回' },
  审核通过: {},
  驳回: { reopen_inspection: '检测中', withdraw: '撤回' },
  撤回: {},
}

const useAuthStore = defineStore('auth.integration', {
  state: () => ({
    token: null as string | null,
    username: '',
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    async login(payload: { username: string; password: string }): Promise<void> {
      if (payload.username !== 'inspector' || payload.password !== 'safe-password-123') {
        throw new Error('用户名或密码错误')
      }
      this.username = payload.username
      this.token = 'test-token'
    },
  },
})

const useInspectionStore = defineStore('inspection.integration', {
  state: () => ({
    nextId: 1,
    projects: [] as InspectionProject[],
  }),
  actions: {
    createProject(name: string): InspectionProject {
      const trimmedName = name.trim()
      if (!trimmedName) throw new Error('检测项目名称不能为空')

      const project: InspectionProject = {
        id: this.nextId,
        name: trimmedName,
        status: '受理',
      }

      this.nextId += 1
      this.projects.unshift(project)
      return project
    },
    transition(projectId: number, action: WorkflowAction): InspectionProject {
      const project = this.projects.find((item) => item.id === projectId)
      if (!project) throw new Error(`检测项目不存在：${projectId}`)

      const nextStatus = transitionTable[project.status][action]
      if (!nextStatus) throw new Error(`非法流程流转：${project.status} -> ${action}`)

      project.status = nextStatus
      return project
    },
  },
})

const LoginPage = defineComponent({
  name: 'LoginPage',
  setup() {
    const username = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const authStore = useAuthStore()
    const router = useRouter()

    async function submit(): Promise<void> {
      errorMessage.value = ''
      try {
        await authStore.login({ username: username.value, password: password.value })
        await router.push('/projects')
      } catch (error) {
        errorMessage.value = error instanceof Error ? error.message : String(error)
      }
    }

    return { username, password, errorMessage, submit }
  },
  template: `
    <section>
      <h1>登录</h1>
      <input data-testid="login-username" v-model="username" aria-label="用户名" />
      <input data-testid="login-password" v-model="password" type="password" aria-label="密码" />
      <button data-testid="login-submit" type="button" @click="submit">登录</button>
      <p v-if="errorMessage" data-testid="login-error">{{ errorMessage }}</p>
    </section>
  `,
})

const ProjectListPage = defineComponent({
  name: 'ProjectListPage',
  setup() {
    const authStore = useAuthStore()
    const inspectionStore = useInspectionStore()
    const projectName = ref('')
    const firstProject = computed(() => inspectionStore.projects[0])

    function createProject(): void {
      inspectionStore.createProject(projectName.value)
      projectName.value = ''
    }

    function startInspection(): void {
      if (!firstProject.value) throw new Error('没有可流转的检测项目')
      inspectionStore.transition(firstProject.value.id, 'start_inspection')
    }

    return { authStore, inspectionStore, projectName, firstProject, createProject, startInspection }
  },
  template: `
    <section>
      <h1>检测项目列表</h1>
      <p data-testid="current-user">当前用户：{{ authStore.username }}</p>
      <input data-testid="project-name" v-model="projectName" aria-label="检测项目名称" />
      <button data-testid="create-project" type="button" @click="createProject">新增项目</button>

      <article v-for="project in inspectionStore.projects" :key="project.id" data-testid="project-card">
        <strong data-testid="project-title">{{ project.name }}</strong>
        <span data-testid="project-status">{{ project.status }}</span>
      </article>

      <button v-if="firstProject" data-testid="start-inspection" type="button" @click="startInspection">
        开始检测
      </button>
    </section>
  `,
})

const AppShell = defineComponent({
  name: 'AppShell',
  components: { RouterLink, RouterView },
  template: `
    <main>
      <nav>
        <RouterLink to="/">登录</RouterLink>
        <RouterLink to="/projects">检测项目</RouterLink>
      </nav>
      <RouterView />
    </main>
  `,
})

function createIntegrationRouter() {
  const routes: RouteRecordRaw[] = [
    { path: '/', component: LoginPage },
    { path: '/projects', component: ProjectListPage },
  ]

  return createRouter({
    history: createMemoryHistory(),
    routes,
  })
}

describe('inspection integration workflow', () => {
  it('完成登录、新增项目和流程流转的数据链路', async () => {
    const pinia = createPinia()
    const router = createIntegrationRouter()

    router.beforeEach((to) => {
      const authStore = useAuthStore(pinia)
      if (to.path === '/projects' && !authStore.isAuthenticated) return '/'
      return true
    })

    await router.push('/')
    await router.isReady()

    const wrapper = mount(AppShell, {
      global: { plugins: [pinia, router] },
    })

    await wrapper.get('[data-testid="login-username"]').setValue('inspector')
    await wrapper.get('[data-testid="login-password"]').setValue('safe-password-123')
    await wrapper.get('[data-testid="login-submit"]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/projects')
    expect(wrapper.get('[data-testid="current-user"]').text()).toContain('inspector')

    await wrapper.get('[data-testid="project-name"]').setValue('混凝土抗压检测')
    await wrapper.get('[data-testid="create-project"]').trigger('click')

    expect(wrapper.get('[data-testid="project-title"]').text()).toBe('混凝土抗压检测')
    expect(wrapper.get('[data-testid="project-status"]').text()).toBe('受理')

    await wrapper.get('[data-testid="start-inspection"]').trigger('click')

    expect(wrapper.get('[data-testid="project-status"]').text()).toBe('检测中')
    expect(useInspectionStore(pinia).projects).toEqual([
      { id: 1, name: '混凝土抗压检测', status: '检测中' },
    ])
  })
})