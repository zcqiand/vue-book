// 模拟异步请求：根据 ID 获取用户信息
function fetchUser(
  id: number,
  callback: (user: { id: number; name: string; role: string }) => void
): void {
  setTimeout((): void => {
    callback({ id, name: 'Alice', role: 'admin' });
  }, 500);
}

// ---- 反例：回调地狱（层层嵌套，缩进失控）----
fetchUser(1, (user): void => {
  console.log('用户：', user.name);
  // 假设还要根据 user.id 再查订单、再查详情……每多一步就多一层缩进
  // 这里已经缩进了多层，逻辑越深越难读
});

// ---- 正例：用 Promise 改写，链式调用扁平化 ----
function fetchUserAsync(id: number): Promise<{ id: number; name: string; role: string }> {
  return new Promise((resolve): void => {
    setTimeout((): void => resolve({ id, name: 'Alice', role: 'admin' }), 500);
  });
}

fetchUserAsync(1)
  .then((user): void => {
    console.log('获取到用户：', user.name);
    console.log('角色：', user.role);
  })
  .catch((error: unknown): void => {
    if (error instanceof Error) {
      console.error('请求失败：', error.message);
    }
  })
  .finally((): void => {
    console.log('请求完成（无论成功或失败）');
  });