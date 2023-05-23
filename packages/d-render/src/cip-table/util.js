import {
  getFieldValue,
  isArray,
  isNotEmpty,
  getPropertyKeyByPath as _getPropertyKeyByPath
} from '@d-render/shared'
import { sizeCellConfig } from './config'
export const analyseData = (list = [], treeProps, count = 0, parentPath = []) => {
  return list.reduce((acc, item, index) => {
    const path = parentPath.concat(index)
    acc[count] = path
    count++
    const children = getFieldValue(item, treeProps.children)
    if (isArray(children)) {
      const indexed = analyseData(children, treeProps, count, path)
      acc = Object.assign(acc, indexed)
      count += Object.keys(indexed).length
    }
    return acc
  }, {})
}
export const getPropertyKeyByPath = _getPropertyKeyByPath
// 根据标准和当前大小计算转换系数
export const calculateCurrentWidth = (size = 'default', standardSize = 'default', width) => {
  // 宽度 = 字体宽度 + padding
  if (size === standardSize) return width
  const standardConfig = sizeCellConfig[standardSize]
  const x = (width - standardConfig.padding * 2) / standardConfig.fontSize
  const currentConfig = sizeCellConfig[size]
  return x * currentConfig.fontSize + currentConfig.padding * 2
}

// 在child对象的所有key前添加childrenKey并用_链接
const generateChildInfo = (child, childrenKey) => {
  return Object.keys(child).reduce((acc, key) => {
    acc[`${childrenKey}_${key}`] = child[key]
    return acc
  }, {})
}
// 对外提供
/**
 * 获取展开childrenKey后的数组，childrenKey的内的key重新为 `${childrenKey}_${key}`
 * @param data 原数组
 * @param childrenKey 待展开的子数组的key
 * @returns {*}
 */
export const getExpendData = (data, childrenKey) => {
  return data.reduce((acc, v) => {
    const children = v[childrenKey].map(child => ({
      ...v,
      ...generateChildInfo(child, childrenKey)
    }))
    if (children.length > 0) {
      children.forEach(child => { child._columns = 0 })
      children[0]._columns = children.length
    }
    acc.push(...children)
    return acc
  }, [])
}

//
/**
 * 生成一个合并column的函数
 * @param excludeFn {Function} 排除判断
 * @returns {(function({row: *, column: *, rowIndex: *, columnIndex: *}): ([number|*,number]|undefined))|*}
 */
export const generateSpanMethod = (excludeFn) => {
  return ({ row, column, rowIndex, columnIndex }) => {
    if (!excludeFn || (excludeFn && !excludeFn({ row, column, rowIndex, columnIndex }))) {
      // 此处项进行判断
      if (isNotEmpty(row._columns)) {
        return [row._columns, 1]
      }
    }
  }
}
