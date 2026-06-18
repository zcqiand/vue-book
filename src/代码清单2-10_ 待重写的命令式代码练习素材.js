// 待重写的命令式代码
var users = [
  { name: 'Alice', age: 25, email: 'alice@test.com' },
  { name: 'Bob', age: 17, email: 'bob@test.com' },
  { name: 'Charlie', age: 30, email: 'charlie@test.com' }
];

var adults = [];
for (var i = 0; i < users.length; i++) {
  if (users[i].age >= 18) {
    adults.push(users[i]);
  }
}

var names = [];
for (var j = 0; j < adults.length; j++) {
  names.push(adults[j].name);
}