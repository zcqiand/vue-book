function getDiscountedPrice(item: Item) {
  console.count('getDiscountedPrice')
  return item.price * item.qty * 0.9
}

function calculateTotal() {
  console.count('calculateTotal')
  return items.value.reduce((s, i) => s + i.price * i.qty, 0)
}