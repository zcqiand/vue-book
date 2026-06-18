// 场景：购物车总价，在模板里只出现一次
// 用 computed 或方法差别不大，因为只算一次
const total = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0))
// 或
function total() { return items.value.reduce((s, i) => s + i.price * i.qty, 0) }

// 场景：在大列表的每个行里显示小计，列表有 100 行
// 用 computed：每行访问同一个 computed，缓存让 100 次访问变成 1 次计算
// 用方法：100 行 × 每行动辄重算 = 灾难性性能问题