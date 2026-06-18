const cardRef = useTemplateRef<InstanceType<typeof ChildCard>>('card')
onMounted(() => {
  cardRef.value?.reset()  // 调用子组件暴露的方法
})