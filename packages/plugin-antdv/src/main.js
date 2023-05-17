export default {
  input: (mode) => () => import(`./input${mode}`),
  rate: (mode) => () => import(`./rate${mode}`)
}
