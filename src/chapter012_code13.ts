const fullName = computed(() => `${firstName.value} ${lastName.value}`)

fullName.value = '李 四'  // Uncaught TypeError: Set operation on computed without setter