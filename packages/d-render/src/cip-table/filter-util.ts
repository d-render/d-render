import { isArray, isInputEmpty, type IAnyObject, type ITableColumnConfig } from '@d-render/shared'

export type TTableFilterModel = IAnyObject
export type TTableFilteredValues = Record<string, string[]>

export interface ITableFilterColumnMeta {
  /** Element Plus 筛选键，对应列 key / ElTableColumn.prop */
  key: string
  /** filterModel 与单元格绑定使用的字段名 */
  columnKey: string
  filterMultiple: boolean
}

const isEmptyFilterValue = (value: unknown) => {
  if (isInputEmpty(value)) return true
  return isArray(value) && (value as unknown[]).length === 0
}

const resolveFilterMultiple = (config: Partial<ITableColumnConfig['config']>) => {
  const configRecord = config as Record<string, unknown>
  return (config.filterMultiple ?? configRecord['filter-multiple'] ?? true) as boolean
}

const resolveColumnKey = (key: string, config: Partial<ITableColumnConfig['config']>) => {
  return config.columnKey ?? key
}

/** 收集带 filters 配置的列，含嵌套 children */
export const collectFilterableColumns = (
  columns: Array<ITableColumnConfig> = []
): Array<ITableFilterColumnMeta> => {
  return columns.reduce<Array<ITableFilterColumnMeta>>((acc, column) => {
    const { key, config } = column
    if (config.hideItem) return acc
    if (isArray(config.children) && (config.children as unknown[]).length > 0) {
      acc.push(...collectFilterableColumns(config.children as ITableColumnConfig[]))
      return acc
    }
    if (config.filters !== undefined) {
      acc.push({
        key,
        columnKey: resolveColumnKey(key, config),
        filterMultiple: resolveFilterMultiple(config)
      })
    }
    return acc
  }, [])
}

/** 基于已收集的 meta 将表格筛选值（Element Plus 格式）转为搜索表单 model */
export const tableFilteredValuesToModel = (
  filteredValues: TTableFilteredValues = {},
  filterableColumns: Array<ITableFilterColumnMeta> = []
): TTableFilterModel => {
  const model: TTableFilterModel = {}
  filterableColumns.forEach(({ key, columnKey, filterMultiple }) => {
    const values = filteredValues[key]
    if (!values?.length) return
    model[columnKey] = filterMultiple ? [...values] : values[0]
  })
  return model
}

/** 基于已收集的 meta 将搜索表单 model 转为表格筛选值（Element Plus 格式） */
export const modelToTableFilteredValues = (
  model: TTableFilterModel = {},
  filterableColumns: Array<ITableFilterColumnMeta> = []
): TTableFilteredValues => {
  const filteredValues: TTableFilteredValues = {}
  filterableColumns.forEach(({ key, columnKey, filterMultiple }) => {
    const value = model[columnKey]
    if (isEmptyFilterValue(value)) {
      filteredValues[key] = []
      return
    }
    if (filterMultiple) {
      filteredValues[key] = isArray(value) ? (value as unknown[]).map(String) : [String(value)]
      return
    }
    filteredValues[key] = [String(value)]
  })
  return filteredValues
}

/** 基于已收集的 meta 合并表格筛选 model，便于与搜索表单局部同步 */
export const mergeTableFilterModel = (
  target: TTableFilterModel,
  source: TTableFilterModel,
  filterableColumns: Array<ITableFilterColumnMeta> = []
): TTableFilterModel => {
  const next = { ...target }
  filterableColumns.forEach(({ columnKey }) => {
    if (isEmptyFilterValue(source[columnKey])) {
      delete next[columnKey]
    } else {
      next[columnKey] = source[columnKey]
    }
  })
  return next
}
