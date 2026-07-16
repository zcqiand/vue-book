import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.id // URL 是 /users/42，这里就是 "42"