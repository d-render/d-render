export default {
  input: (mode) => () => import(`./input${mode}`),
  default: () => () => import('./input/index')
}
