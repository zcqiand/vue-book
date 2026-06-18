// pages/posts/[id].vue
const route = useRoute()
const { data: post } = await useFetch(`/api/posts/${route.params.id}`)