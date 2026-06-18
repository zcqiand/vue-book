const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue: string) {
    const [first, last] = newValue.split(' ')
    firstName.value = first
    lastName.value = last
  }
})