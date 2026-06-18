interface User {
  name: string;
  age: number;
}

const user: User = { name: 'Vue', age: 3 };

// 解构：取出 name，得到一个独立的字符串值
const { name } = user;
console.log(name);      // 'Vue'
console.log(user.name); // 'Vue'

// 关键时刻：修改原对象的属性
user.name = 'Vue.js';
user.age = 4;

// name 不会跟着变——它只是解构那一刻的一个快照
console.log(name);      // 仍然是 'Vue'（没变！）
console.log(user.name); // 'Vue.js'

// 原因：name 拿到的是字符串的值的拷贝，不是对 user.name 的引用
// 解构这一步之后，name 和 user.name 之间的联系就被切断了

// ---- 数组解构同理：也是值的快照 ----
const list: number[] = [10, 20];
const [first] = list;
list[0] = 99;
console.log(first);  // 10（没变）
console.log(list[0]); // 99