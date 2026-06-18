// ---- 反例：var 在 for 循环中的闭包坑 ----
var funcs: (() => number)[] = [];

for (var i = 0; i < 3; i++) {
  funcs.push(function (): number {
    return i;
  });
}

console.log(funcs[0]()); // 3（不是 0！）
console.log(funcs[1]()); // 3（不是 1！）
console.log(funcs[2]()); // 3
// 原因：var 是函数作用域，三个函数共享同一个 i
// 循环结束时 i 已经变成 3，所以调用每个函数都返回 3

// ---- 正例：let 修复闭包坑 ----
const funcsLet: (() => number)[] = [];

for (let j = 0; j < 3; j++) {
  funcsLet.push(function (): number {
    return j;
  });
}

console.log(funcsLet[0]()); // 0
console.log(funcsLet[1]()); // 1
console.log(funcsLet[2]()); // 2
// 原因：let 是块级作用域，每次循环都创建一个新的 j

// ---- 变量提升反例 ----
// @ts-expect-error TS2454：TS 检测到 greeting 在赋值前被使用
// 这正是 var 提升带来的运行时现象——引擎把声明提到顶部（值为 undefined），赋值留在原地
// 所以这行在运行时会打印 undefined，而不是抛 ReferenceError（let/const 才会）
console.log(greeting); // undefined（运行时不报错，但值是 undefined）
var greeting: string = 'hello';
// 等同于引擎把声明提到顶部，赋值留在原位

// ---- const 不可重新赋值，但对象属性可改 ----
const framework: string = 'Vue';
// framework = 'React'; // TypeError: Assignment to constant variable

const user: { name: string; age: number } = { name: 'Vue', age: 3 };
user.name = 'Vue.js'; // 合法：修改的是属性，不是 user 本身
user.age = 4;         // 合法
// user = { name: 'Angular', age: 5 }; // TypeError：重新赋值不允许