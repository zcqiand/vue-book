// 组织树（与 React orgStore 对齐，只增不改既有方法）
async function fetchOrgTree(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const { data } = await apiClient.get<OrgNode>('/orgs')
    tree.value = data
  } catch (err) {
    error.value = extractErrorMessage(err, '组织架构加载失败')
  } finally {
    loading.value = false
  }
}
async function createOrgNode(name: string, parentId: string): Promise<void> {
  loading.value = true
  error.value = null
  try {
    await apiClient.post('/orgs', { name, parentId })
    await fetchOrgTree()
  } catch (err) {
    loading.value = false
    error.value = extractErrorMessage(err, '组织节点创建失败')
  }
}
async function updateOrgNode(id: string, name: string): Promise<void> {
  loading.value = true
  error.value = null
  try {
    await apiClient.put(`/orgs/${id}`, { name })
    await fetchOrgTree()
  } catch (err) {
    loading.value = false
    error.value = extractErrorMessage(err, '组织节点更新失败')
  }
}
async function deleteOrgNode(id: string): Promise<void> {
  loading.value = true
  error.value = null
  try {
    await apiClient.delete(`/orgs/${id}`)
    await fetchOrgTree()
  } catch (err) {
    loading.value = false
    error.value = extractErrorMessage(err, '组织节点删除失败')
  }
}