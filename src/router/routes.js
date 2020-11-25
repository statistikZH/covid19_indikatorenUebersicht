
const routes = [
  { path: '/', redirect: '/Alle' },
  { path: '/:filter?', component: () => import('pages/Index.vue') }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
