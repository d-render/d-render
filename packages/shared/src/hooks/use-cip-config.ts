import { inject } from 'vue'
import { IAnyObject } from '../utils'
// !!IMPORTANT: cip-config-provide的注入功能，需要保持key为字符串不然就需要依赖cip组件

interface CipConfig {
  defaultViewValue: unknown
  limit: IAnyObject
  buttonConfigMap: IAnyObject
  layout: IAnyObject
  number: IAnyObject
  table: IAnyObject
  main: IAnyObject
}

export const useCipConfig = () => {
  const cipConfig = inject<Partial<CipConfig>>('cip-config', {
    limit: {},
    buttonConfigMap: {},
    layout: {},
    number: {},
    table: {},
    main: {}
  })
  return cipConfig
}

export const useCipPageConfig = () => {
  const cipPageConfig = inject('cip-page-config', {
    table: {},
    searchForm: {}
  })
  return cipPageConfig
}
