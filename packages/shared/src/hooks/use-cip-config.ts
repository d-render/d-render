import { inject } from 'vue'
import { IAnyObject } from '../utils'
// !!IMPORTANT: cip-config-provide的注入功能，需要保持key为字符串不然就需要依赖cip组件

export interface ITransformWidthOption {
  columnType?: 'index' | 'selection' | 'radio' | 'expand' | 'handler'
}

interface CipTableConfig {
  size?: string
  sizeStandard?: string
  defaultViewValue?: unknown
  /**
   * 自定义 px 宽度转换函数，优先级高于 size/sizeStandard 的换算逻辑。
   * 接收列配置的原始 px 数值，返回实际渲染宽度（不含 border 补偿，内部会自动叠加）。
   * @example (px) => px * window.devicePixelRatio
   */
  transformPx?: (px: number, option?: ITransformWidthOption) => number
  [key: string]: unknown
}

interface CipConfig {
  defaultViewValue: unknown
  limit: IAnyObject
  buttonConfigMap: IAnyObject
  layout: IAnyObject
  number: IAnyObject
  table: CipTableConfig
  form: { errorMode?: 'default' | 'tooltip'}
  main: IAnyObject
  quirks: boolean
}

export const useCipConfig = () => {
  const cipConfig = inject<Partial<CipConfig>>('cip-config', {
    limit: {},
    buttonConfigMap: {},
    layout: {},
    number: {},
    table: {},
    form: {},
    main: {}
  })
  return cipConfig
}

export const useCipPageConfig = () => {
  const cipPageConfig = inject('cip-page-config', {
    form: {},
    table: {},
    searchForm: {}
  })
  return cipPageConfig
}
