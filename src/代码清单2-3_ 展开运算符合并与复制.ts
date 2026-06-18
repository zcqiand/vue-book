// ---- 对象合并（默认配置 + 用户覆盖）----
interface AppConfig {
  theme: string;
  lang: string;
  timeout: number;
}

const defaults: AppConfig = { theme: 'light', lang: 'zh', timeout: 3000 };
const overrides: Partial<AppConfig> = { theme: 'dark' };

// 后面的同名属性覆盖前面的，得到完整配置
const merged: AppConfig = { ...defaults, ...overrides };
console.log(merged);
// { theme: 'dark', lang: 'zh', timeout: 3000 }

// ---- 展开是浅拷贝：嵌套对象仍共享引用 ----
const nested: { info: { score: number } } = { info: { score: 90 } };
const copied: { info: { score: number } } = { ...nested };
copied.info.score = 100;
console.log(nested.info.score); // 100（不是 90！嵌套对象是同一个引用）