// ---- 文件：src/utils/math-utils.ts ----
// 具名导出（命名导出）：一个文件可导出多个成员
export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export const PI: number = 3.14159;

// 具名导出也可以先定义再统一导出
function subtract(a: number, b: number): number {
  return a - b;
}
export { subtract };