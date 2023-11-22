import { cloneDeep, toUpperFirstCase } from '@d-render/shared'
import { DRender } from 'd-render'

export const isLayoutType = (type) => {
  return new DRender().isLayoutType(type)
}
// 允许有otherValue的字段
export const twoValueComponentList = ['dateRange', 'timeRange', 'numberRange', 'resourceFormTable', 'dataDictionary', 'staff', 'roleDictionary', 'office', 'formCountersignPerson']
export const threeValueComponentList = ['roleDictionary']
let cacheKey = 0
export const generateFieldKey = (type = 'error') => {
  cacheKey++ // 避免复制组的时候key id重复
  return `${type}_${Date.now()}${cacheKey}`
}
// 甚于类型的复制方式
export const getCopyItem = (item) => {
  const result = cloneDeep(item)
  const type = item.config.type
  const sign = generateFieldKey(type)
  result.id = sign
  result.key = sign
  if (twoValueComponentList.includes(type)) {
    result.config.otherKey = `other${toUpperFirstCase(sign)}`
  }
  if (threeValueComponentList.includes(type)) {
    result.config.extraKey = `extra${toUpperFirstCase(sign)}`
  }
  return result
}
// layout 类型的复制方式
export const getCopyLayout = (layout) => {
  const newLayout = getCopyItem(layout) // 修改自身标记
  newLayout.config.options?.forEach?.(option => { // 修改子row标记
    const children = option.children || []
    if (children.length > 0) {
      option.children = children.map(getCopyRow)
    }
  })
  return newLayout
}
// table 的复制方式
export const getCopyTable = (table) => {
  const newTable = getCopyItem(table) // 修改自身标记
  const options = newTable.config?.options || []
  if (options?.length > 0) {
    newTable.config.options = options.map(getCopyRow)
  }
  return newTable
}
// 复制一列
export const getCopyRow = (row) => {
  const type = row.config?.type
  if (isLayoutType(type)) {
    return getCopyLayout(row)
  } else if (type === 'table') {
    return getCopyTable(row)
  } else {
    return getCopyItem(row)
  }
}

export const getTableItem = (item) => {
  const result = cloneDeep(item)
  const type = item.config.type
  result.id = item.config.key
  result.key = item.config.key
  if (twoValueComponentList.includes(type)) {
    result.config.otherKey = `other${toUpperFirstCase(item.config.key)}`
  }
  return result
}

/**
 * 列表设计左侧组件处理
 * except是排除不需要在列表中展示的组件, 格栅布局需要展开后，在最下边排除
 */
export const except = ['image', 'file', 'table', 'resourceFormTable']
// 展开格栅布局中的组件
export const formConfigListFlat = (list = [], cb, formList = []) => {
  list.map(item => {
    if (isLayoutType(item.config.type)) {
      // eslint-disable-next-line
      const options = item.config.options || []
      const children = options.map(option => option.children).flat()
      formConfigListFlat(children, cb, formList)
    } else {
      if (cb) {
        cb(formList, item)
      } else {
        formList.push(item)
      }
    }
  })
  return formList
}
