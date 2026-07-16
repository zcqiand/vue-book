const contacts = reactive([
  { type: 'phone', value: '' },
  { type: 'email', value: '' }
])

function addContact() {
  contacts.push({ type: 'phone', value: '' })  // 指定初始结构
}