const name = ref('')           // 推断为 Ref<string>
const age = ref(25)            // 推断为 Ref<number>
const user = ref({ id: 1 })    // 推断为 Ref<{ id: number }>