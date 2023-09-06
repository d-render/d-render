// 例：
// mode 可能参数为/index /view /mobile /configure
// test: (mode) => () => import(`@/components/hello-component${mode}`)
// test: {
//   component: (mode) => () => import(`@/components/hello-component${mode}`)
// }
// testLayout: {
//   component: (mode) => () => import(`@/components/hello-component${mode}`)
//   layout: true
// }

export default {
  flashFill: {
    component: (mode) => () => import(`./flash-fill${mode}`)
  },
  fieldMapping: {
    component: (mode) => () => import(`./field-mapping${mode}`)
  },
  optionsConfigure: () => () => import('./options-configure/index')
}
