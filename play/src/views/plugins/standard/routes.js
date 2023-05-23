export const routes = [
  {
    name: 'standardOverview',
    path: '/plugin/standard/overview',
    component: () => import('./overview')
  },
  {
    name: 'standardInput',
    path: '/plugin/standard/input',
    component: () => import('./input')
  }
]
