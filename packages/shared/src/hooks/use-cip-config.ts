import { inject } from 'vue'
import { IAnyObject } from '../utils'
// !!IMPORTANT: cip-config-provide的注入功能，需要保持key为字符串不然就需要依赖cip组件

/**
 * 宽度换算时所处的列角色。
 * - `data`: 业务数据列（配置 width/minWidth，以及 datetime 默认宽）
 * - `index`: 序号列
 * - `selection`: 多选 / 单选列
 * - `expand`: 展开列
 * - `handler`: 操作列
 */
export type TTransformWidthColumnType = 'data' | 'index' | 'selection' | 'expand' | 'handler'

export interface ITransformWidthOption {
  columnType?: TTransformWidthColumnType
}

interface CipTableConfig {
  size?: string
  sizeStandard?: string
  defaultViewValue?: unknown
  /**
   * 自定义 px 宽度转换函数，优先级高于 size/sizeStandard 的换算逻辑。
   * 接收列配置的原始 px 数值，返回实际渲染宽度（不含 border 补偿，内部会自动叠加）。
   * 第二个参数 `option.columnType` 标识当前列角色，便于按类型使用不同换算策略。
   *
   * @example 统一按设备像素比缩放
   * (px) => px * window.devicePixelRatio
   *
   * @example 数据列缩放，结构列保持原始宽度
   * (px, option) => option?.columnType === 'data' ? px * scale : px
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
