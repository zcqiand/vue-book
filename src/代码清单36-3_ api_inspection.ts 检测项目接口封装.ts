import { http } from '@/api/http'
import type { PagedList, ListQuery } from '@/composables/useResource'

export type ProjectStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export interface Project {
  id: number
  name: string
  client: string
  status: ProjectStatus
  createdAt: string
  updatedAt: string
}

export type ProjectPayload = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>

export interface ProjectSearch {
  name?: string
  status?: ProjectStatus
}

type ProjectListQuery = ListQuery & ProjectSearch

export async function listProjects(query: ProjectListQuery): Promise<PagedList<Project>> {
  const { data } = await http.get<PagedList<Project>>('/projects', { params: query })
  return data
}

export async function createProject(payload: ProjectPayload): Promise<Project> {
  const { data } = await http.post<Project>('/projects', payload)
  return data
}

export async function updateProject(id: Project['id'], payload: Partial<ProjectPayload>): Promise<Project> {
  const { data } = await http.patch<Project>(`/projects/${id}`, payload)
  return data
}

export async function removeProject(id: Project['id']): Promise<void> {
  await http.delete(`/projects/${id}`)
}