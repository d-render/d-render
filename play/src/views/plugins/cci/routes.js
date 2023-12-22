export const routes = [
  {
    name: 'cciOverview',
    path: '/plugin/cci/overview',
    component: () => import('./overview')
  },
  {
    name: 'cciInput',
    path: '/plugin/cci/input',
    component: () => import('./input')
  }
]
