// ---- 对象解构 + 重命名 + 默认值 ----
interface Person {
  name: string;
  age: number;
  city: string;
  role?: string;
}

const person: Person = { name: 'Alice', age: 25, city: 'Beijing' };

const { name, age, city } = person;
console.log(name); // 'Alice'
console.log(age);  // 25

// 重命名 + 默认值（从配置或 props 提取时常用）
const { name: userName, role = 'guest' } = person;
console.log(userName); // 'Alice'
console.log(role);     // 'guest'（字段缺失，使用默认值）

// ---- 数组解构 + rest 收集 ----
const scores: number[] = [90, 85, 78, 92, 88];

const [first, second] = scores;
console.log(first, second); // 90 85

const [head, ...rest] = scores;
console.log(head); // 90
console.log(rest); // [85, 78, 92, 88]

// ---- 对象解构 + rest 剩余属性 ----
const { name: picked, ...restProps } = person;
console.log(picked);    // 'Alice'
console.log(restProps); // { age: 25, city: 'Beijing' }