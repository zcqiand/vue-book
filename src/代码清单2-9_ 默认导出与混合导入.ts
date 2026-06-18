// ---- 文件：src/utils/logger.ts ----
// 默认导出：一个文件只能有一个默认导出，通常是该文件的主要成员
export default function log(message: string): void {
  console.log(`[log] ${message}`);
}

// 默认导出与具名导出可以共存
export const LEVEL_INFO: string = 'info';
export const LEVEL_ERROR: string = 'error';

// ---- 文件：src/app.ts（导入方）----
// 具名导入：花括号包裹，名称必须匹配
import { add, multiply, PI } from './utils/math-utils';

// 默认导入：不需要花括号，名称可自定义
import log from './utils/logger';

// 混合导入：默认成员在前，具名成员在后
import logMessage, { LEVEL_INFO, LEVEL_ERROR } from './utils/logger';

// 具名导入时可用 as 重命名，避免命名冲突
import { PI as PI_VALUE } from './utils/math-utils';

console.log(add(2, 3));       // 5
console.log(multiply(4, PI)); // 12.56636
log('应用启动');              // [log] 应用启动
console.log(LEVEL_INFO);      // 'info'
console.log(PI_VALUE);        // 3.14159