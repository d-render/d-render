import { v4 as uuid } from 'uuid'
import { cloneDeep, toUpperFirstCase, IFieldItem, IAnyObject } from '../utils'
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
export const getCopyItem = (item: IFieldItem) => {
  const result = cloneDeep(item) as (IFieldItem & {id: string})
  const config = result.config as IAnyObject
  const type = config.type as string | undefined
  const sign = generateFieldKey(type)
  result.id = sign
  result.key = sign
  if (twoValueComponentList.includes(type!)) {
    config.otherKey = `other${toUpperFirstCase(sign)}`
  }
  if (threeValueComponentList.includes(type!)) {
    config.otherKey = [`other${toUpperFirstCase(sign)}`, `extra${toUpperFirstCase(sign)}`]
  }
  return result
}
// layout 类型的复制方式
export const getCopyLayout = (layout: IFieldItem, typeMap: Record<string, string>) => {
  const newLayout = getCopyItem(layout); // 修改自身标记
  ((newLayout.config as IAnyObject).options as Array<{children: IFieldItem[]}>)?.forEach?.((option) => {
    // 修改子row标记
    const children = option.children || []
    if (children.length > 0) {
      option.children = children.map((child) => getCopyRow(child, typeMap))
    }
  })
  return newLayout
}
// table 的复制方式
export const getCopyTable = (table: IFieldItem, typeMap: Record<string, string> = {}) => {
  const newTable = getCopyItem(table) // 修改自身标记
  const config = newTable.config as IAnyObject
  const options = (config?.options || []) as Array<IFieldItem>
  if (options?.length > 0) {
    config.options = options.map((option) => getCopyRow(option, typeMap))
  }
  return newTable
}
// 复制一列
export const getCopyRow = (row: IFieldItem, typeMap: Record<string, string> = {}) => {
  const type = row.config?.type
    ? typeMap[row.config?.type] ?? row.config?.type
    : 'default'
  if (dRender.isLayoutType(type!)) {
    return getCopyLayout(row, typeMap)
  } else {
    return getCopyItem(row)
  }
}

export const getTableItem = (item: IFieldItem) => {
  const result = cloneDeep(item) as (IFieldItem & {id: string})
  const config = result.config as IAnyObject
  const type = config.type as string | undefined
  result.id = config.key as string
  result.key = config.key as string
  if (twoValueComponentList.includes(type!)) {
    config.otherKey = `other${toUpperFirstCase(config.key as string)}`
  }
  return result
}
