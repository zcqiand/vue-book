export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUserStore()
  if (!user.isLoggedIn && to.path !== '/login') {
    return navigateTo('/login')
  }
})