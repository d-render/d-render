import { v4 as uuid } from 'uuid'
import { cloneDeep, toUpperFirstCase } from '@d-render/shared'
import { DRender } from 'd-render'
import { getFieldValue } from '@d-render/shared'
export const isLayoutType = (type) => {
  return new DRender().isLayoutType(type)
}
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
    result.config.otherKey = [`other${toUpperFirstCase(sign)}`, `extra${toUpperFirstCase(sign)}`]
  }
  return result
}
// layout 类型的复制方式
export const getCopyLayout = (layout) => {
  const newLayout = getCopyItem(layout) // 修改自身标记
  newLayout.config.options?.forEach?.((option) => {
    // 修改子row标记
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


export const depthFirstSearchTree = (list, value, key) => {
  const searchTree = (tree, value, key) => {
    if (!tree) return
    if (getFieldValue(tree, key) === value) {
      const { children, ...useObject } = tree
      return [useObject]
    }
    const _children = isLayoutType(tree?.config?.type) ? (tree.config?.children || tree.config?.options) : (tree.children || tree.options)
    if (!_children) return
    for (let i = 0, loop = _children.length; i < loop; i++) {
      const result = searchTree(_children[i], value, key)
      if (result) {
        const { children, ...useObject } = tree
        result.unshift(useObject)
        return result
      }
    }
  }
  let _list = []
  for (let i = 0, len = list.length; i < len; i++) {
    _list = searchTree(list[i], value, key) || []
    if (_list.length) break
  }
  return _list
}
