import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/framework/index'),
    children: [
      {
        path: '/cip-form/base',
        name: 'cipFormBase',
        // route level code-splitting
        // this generates a separate chunk (cip-form.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "cip-form" */ '../views/form/base/index')
      },
      {
        path: '/cip-form/ganged',
        name: 'cipFormGanged',
        component: () => import('../views/form/ganged')
      },
      {
        path: '/changelog/d-render',
        name: 'dRenderChangelog',
        component: () => import('../views/change-log/d-render')
      }
    ]
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
