import { getFieldValue, isEmpty, isArray, type IAnyObject } from '@d-render/shared'
import type { ITreeProps } from './table-props'

export type TRowKeyGetter = (row: IAnyObject) => unknown

/** 兼容 rowKey 为 string 或 function（el-table 原生 row-key 支持两种形式） */
export const resolveRowKeyGetter = (rowKey: unknown): TRowKeyGetter | undefined => {
  if (typeof rowKey === 'function') return rowKey as TRowKeyGetter
  if (typeof rowKey === 'string' && rowKey) return (row: IAnyObject) => getFieldValue(row, rowKey)
  return undefined
}

export type TRowMatcher = (row: IAnyObject) => boolean

/**
 * 基于 model 预建 Set 索引，返回一个 O(1) 的行匹配函数。
 * 避免对每一行都在 model 上做线性扫描（model 在 reserveSelection 场景下是跨页累计的选中列表，可能很大），
 * 将整体匹配复杂度从 O(pageSize * modelSize) 降为 O(pageSize + modelSize)。
 * 匹配优先级：对象引用相同；其次按 rowKey 匹配。
 */
export const createRowMatcher = (
  model: IAnyObject[],
  rowKeyGetter?: TRowKeyGetter
): TRowMatcher => {
  const refSet = new Set<IAnyObject>(model)
  if (!rowKeyGetter) return row => refSet.has(row)
  const keySet = new Set<unknown>()
  model.forEach(item => {
    const key = rowKeyGetter(item)
    if (!isEmpty(key)) keySet.add(key)
  })
  return row => {
    if (refSet.has(row)) return true
    const key = rowKeyGetter(row)
    return !isEmpty(key) && keySet.has(key)
  }
}

/** 展开 treeProps.children 的所有层级行，非树形表格（未配置 children）时原样返回 */
export const flattenTreeRows = (data: IAnyObject[] = [], treeProps?: ITreeProps): IAnyObject[] => {
  const childrenKey = treeProps?.children
  if (!childrenKey) return data
  return data.reduce<IAnyObject[]>((acc, row) => {
    acc.push(row)
    const children = getFieldValue(row, childrenKey)
    if (isArray(children)) {
      acc.push(...flattenTreeRows(children as IAnyObject[], treeProps))
    }
    return acc
  }, [])
}
