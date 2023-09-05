export const routes = [
  {
    path: '/playground/form-design',
    name: 'PlaygroundFormDesign',
    component: () => import('./form-design')
  },
  {
    path: '/playground/custom-form-design',
    name: 'PlaygroundCustomFormDesign',
    component: () => import('./custom-form-design')
  },
  {
    path: '/playground/table-design',
    name: 'PlaygroundTableDesign',
    component: () => import('./table-design')
  }
]
