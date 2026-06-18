const routes = [
  { path: '/', component: () => import('./views/Home.vue') },
  { path: '/users/:id', component: () => import('./views/User.vue') },
]