watchEffect(async () => {
  const id = currentTabId.value
  const res = await fetchUserList(id)
  userList.value = res.data  // 问题在这里
})