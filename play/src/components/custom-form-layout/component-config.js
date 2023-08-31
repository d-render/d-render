export default {
  pageLayoutList: {
    component: () => () => import('./page-layout-list/index'),
    layout: true
  },
  tableDesign: {
    component: () => () => import('./table-design/index'),
    layout: true
  }
}
