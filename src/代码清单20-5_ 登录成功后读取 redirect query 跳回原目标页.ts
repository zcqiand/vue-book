import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

function handleLogin() {
  localStorage.setItem('token', 'demo-token')
  const target = (route.query.redirect as string) || '/admin'
  router.push(target)
}