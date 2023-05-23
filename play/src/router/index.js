import { createRouter, createWebHistory } from 'vue-router'
// import { prependRoutes, getBaseName, getDefaultBaseRoute } from '@cip/utils/route-util.js'
const ctx = require.context('@/views', true, /(\w+\/)*(routes\/index|routes)\.js$/i)

const getChildren = (ctx) => {
  const result = []
  const paths = ctx.keys()
  paths.forEach(path => {
    const routes = ctx(path).routes || []
    result.push(...routes)
  })
  return result
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/framework/index'),
    children: [

      {
        path: '/changelog/d-render',
        name: 'dRenderChangelog',
        component: () => import('../views/change-log/d-render')
      }
    ].concat(getChildren(ctx))
  }

]
console.log(routes)
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
