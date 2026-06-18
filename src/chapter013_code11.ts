watch(() => form.user.address.city, (city) => {
  console.log('城市变化：', city)
})