// ---- 反例：普通函数作为回调，this 丢失 ----
const timer: {
  seconds: number;
  start(): void;
} = {
  seconds: 0,
  start(): void {
    console.log('start 时 this.seconds =', this.seconds); // 0

    // 注：普通函数回调显式标注 this: unknown，仅为通过 TS strict(noImplicitThis)
    // 运行时 this 由调用方式决定（不是词法 this）
    setTimeout(function (this: unknown): void {
      // 普通函数有自己的 this，由调用方式决定
      // 这里调用者是全局对象（浏览器中是 window）或宿主对象（Node/Vite 下是 Timeout 对象），不是 timer
      console.log('普通函数回调中 this =', this); // window（浏览器）或 Timeout 对象（Node 环境），总之不再是 timer
    }, 100);
  },
};

timer.start();

// ---- 正例：箭头函数自动捕获外层 this ----
const timerArrow: {
  seconds: number;
  start(): void;
} = {
  seconds: 0,
  start(): void {
    console.log('start 时 this.seconds =', this.seconds); // 0

    setTimeout((): void => {
      // 箭头函数没有自己的 this，继承外层 start 方法的 this（即 timerArrow）
      console.log('箭头函数回调中 this.seconds =', this.seconds); // 0
    }, 100);
  },
};

timerArrow.start();

// ---- 简写形式：单参数可省括号，单表达式可省 return 和花括号 ----
const double = (n: number): number => n * 2;
const greet = (name: string): string => `你好，${name}`;

console.log(double(5));   // 10
console.log(greet('Vue')); // '你好，Vue'