// 复用上一段定义的 fetchUserAsync
async function fetchUserAsync(
  id: number
): Promise<{ id: number; name: string; role: string }> {
  return new Promise((resolve, reject): void => {
    setTimeout((): void => {
      if (id > 0) {
        resolve({ id, name: 'Alice', role: 'admin' });
      } else {
        reject(new Error('用户 ID 必须大于 0'));
      }
    }, 500);
  });
}

// ---- async/await + try/catch：像写同步代码一样写异步 ----
async function loadUser(id: number): Promise<void> {
  try {
    const user = await fetchUserAsync(id);
    console.log('获取到用户：', user.name);
    console.log('角色：', user.role);
  } catch (error) {
    // TS 中 catch 的 error 是 unknown，需要类型窄化
    if (error instanceof Error) {
      console.error('请求失败：', error.message);
    }
  } finally {
    console.log('请求完成（无论成功或失败）');
  }
}

loadUser(1);

// ---- 模拟 Vue 中调用后端接口的真实场景 ----
// 用浏览器内置的 fetch 请求接口，await 直接拿到响应
async function loadProfile(apiBase: string): Promise<void> {
  try {
    const response: Response = await fetch(`${apiBase}/profile`);
    if (!response.ok) {
      throw new Error(`HTTP 错误：${response.status}`);
    }
    const data: unknown = await response.json();
    console.log('用户资料：', data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('加载资料失败：', error.message);
    }
  }
}

// ---- 并发请求：Promise.all 同时发出多个请求 ----
async function loadMultipleUsers(): Promise<void> {
  const ids: number[] = [1, 2, 3];

  // 三个请求同时发出，全部完成后才返回结果数组
  const users = await Promise.all(
    ids.map((id: number) => fetchUserAsync(id))
  );

  console.log('所有用户：', users);
}

loadMultipleUsers();