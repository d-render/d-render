import { v4 as uuid } from 'uuid'
import { cloneDeep, toUpperFirstCase, IFormConfig } from '../utils'
import { DRender } from './d-render'
const dRender = new DRender()

// 允许有otherValue的字段
export const twoValueComponentList = [
  'dateRange',
  'timeRange',
  'numberRange',
  'resourceFormTable',
  'dataDictionary',
  'staff',
  'roleDictionary',
  'office',
  'formCountersignPerson',
  'role'
]
export const threeValueComponentList = ['roleDictionary']
export const generateFieldKey = (type = 'error') => {
  return `${type}_${uuid().split('-')[0]}` // ${Date.now()}${cacheKey}
}
// 甚于类型的复制方式
export const getCopyItem = (item: IFormConfig<Record<string, unknown>>) => {
  const result = cloneDeep(item) as (IFormConfig<Record<string, unknown>> & {id: string})
  const type = item.config.type
  const sign = generateFieldKey(type)
  result.id = sign
  result.key = sign
  if (twoValueComponentList.includes(type!)) {
    result.config.otherKey = `other${toUpperFirstCase(sign)}`
  }
  if (threeValueComponentList.includes(type!)) {
    result.config.otherKey = [`other${toUpperFirstCase(sign)}`, `extra${toUpperFirstCase(sign)}`]
  }
  return result
}
// layout 类型的复制方式
export const getCopyLayout = (layout: IFormConfig<Record<string, unknown>>) => {
  const newLayout = getCopyItem(layout); // 修改自身标记
  (newLayout.config.options as Array<{children: IFormConfig<Record<string, unknown>>[]}>)?.forEach?.((option) => {
    // 修改子row标记
    const children = option.children || []
    if (children.length > 0) {
      option.children = children.map(getCopyRow)
    }
  })
  return newLayout
}
// table 的复制方式
export const getCopyTable = (table: IFormConfig<Record<string, unknown>>) => {
  const newTable = getCopyItem(table) // 修改自身标记
  const options = (newTable.config?.options || []) as Array<IFormConfig<Record<string, unknown>>>
  if (options?.length > 0) {
    newTable.config.options = options.map(getCopyRow)
  }
  return newTable
}
// 复制一列
export const getCopyRow = (row: IFormConfig<Record<string, unknown>>) => {
  const type = row.config?.type
  if (dRender.isLayoutType(type!)) {
    return getCopyLayout(row)
  } else {
    return getCopyItem(row)
  }
}

export const getTableItem = (item: IFormConfig<Record<string, unknown>>) => {
  const result = cloneDeep(item) as (IFormConfig<Record<string, unknown>> & {id: string})
  const type = item.config.type
  result.id = item.config.key as string
  result.key = item.config.key as string
  if (twoValueComponentList.includes(type!)) {
    result.config.otherKey = `other${toUpperFirstCase(item.config.key as string)}`
  }
  return result
}
