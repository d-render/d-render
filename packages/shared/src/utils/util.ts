// @ts-ignore
import lodashCloneDeep from 'lodash-es/cloneDeep'
export type IAnyObject = Record<string, unknown>
/**
 * @function 深拷贝
 * @param value {*}
 * @return {*}
 */
export const cloneDeep = <T>(value: T): T => {
  return lodashCloneDeep(value)
}
/**
 * @function 2个对象值进行比较
 * @param objectA
 * @param objectB
 * @return {boolean}
 */
export const objectEqual = (objectA: IAnyObject = {}, objectB:IAnyObject = {}) => {
  if (objectA === objectB) return true
  const keysA = Object.keys(objectA)
  const keysB = Object.keys(objectB)
  if (keysA.length !== keysB.length) return false
  const keysLength = keysA.length
  for (let i = 0; i < keysLength; i++) {
    const keyA = keysA[i]
    if (!keysB.includes(keyA)) return false
    const valueA = objectA[keyA]
    const valueB = objectB[keyA]
    if (typeof valueA === 'object' && typeof valueB === 'object') {
      if (!objectEqual(valueA as IAnyObject, valueB as IAnyObject)) return false
    } else {
      if (valueA !== valueB) return false
    }
  }
  // 排除所有不想等的情况
  return true
}
/**
 * 节流
 * @param fn {Function} 方法
 * @param delay {Number} 延迟执行时间
 * @return {function(): void}
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function throttle (fn: Function, delay: number) {
  let pre = 0
  return function (this: unknown, ...args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    const now = Date.now()
    if (now - pre > delay) {
      pre = now
      fn.apply(this, args)
    }
  }
}

/**
 *
 * @param fn
 * @param wait
 * @param immediate
 * @return {function(): *}
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (fn: Function, wait: number, immediate: boolean): unknown => {
  let timer: number | undefined | null
  let result: unknown
  const debounced = function (this: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this
    // eslint-disable-next-line prefer-rest-params
    const args = arguments as unknown as unknown[]
    if (timer) clearTimeout(timer)
    if (immediate) {
      // 如果已经执行过，不再执行
      const callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, wait)
      if (callNow) result = fn.apply(context, args)
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, wait)
    }
    return result
  }
  debounced.cancel = () => {
    clearTimeout(timer!)
    timer = null
  }
  return debounced
}

/**
 * 大写第一位字符串
 * @param str {String} 字符串
 * @return {string}
 */
export const toUpperFirstCase = (str: string) => {
  const first = str.charAt(0)
  const upperFirst = first.toUpperCase()
  return upperFirst + str.slice(1)
}

/**
 * 平铺数组转换为树状结构
 * @param list {Array} 数组列表
 * @param parentKey {String} 父节点名称
 * @param root {Number} 根节点值
 * @return {boolean}
 */
export const toTreeData = (list: Array<IAnyObject>, parentKey = 'parentId', root = 0) => {
  const cloneData = cloneDeep(list)
  const tree = cloneData.filter((father) => {
    const branchArr = cloneData.filter((child) => {
      return father.id === child[parentKey]
    })
    if (branchArr.length > 0) {
      father.children = branchArr
    }
    return father[parentKey] === root
  })
  tree.forEach(row => {
    row[parentKey] = ''
  })
  return tree
}
/**
 * 判断值是否为undefined或null
 * @param value {*} 待判断值
 * @return {boolean}
 */
export const isEmpty = (value: unknown) => {
  return value === undefined || value === null
}
/**
 * 判断值是否为undefined或null或空字符串
 * @param value {*} 待判断值
 * @return {boolean}
 */
export const isInputEmpty = (value: unknown) => {
  return value === undefined || value === null || value === ''
}
/**
 * 判断值是否不为undefined或null
 * @param value {*} 待判断值
 * @return {boolean}
 */
export const isNotEmpty = (value: unknown) => {
  return !isEmpty(value)
}
/**
 * 是否为没有空对象
 * @param value {Object} 待判断对象
 * @return {boolean}
 */
export const isEmptyObject = (value: IAnyObject) => {
  return Object.keys(value).length === 0
}
/**
 * 判断值是否为数组
 * @param value {*}
 * @return {boolean}
 */
export const isArray = (value: unknown) => {
  return Object.prototype.toString.call(value) === '[object Array]'
}
/**
 * 判断是否对象
 * @param value
 * @return {boolean}
 */
export const isObject = (value: unknown) => {
  return Object.prototype.toString.call(value) === '[object Object]'
}
/**
 * 判断是否为字符串
 * @param value
 * @return {boolean}
 */
export const isString = (value: unknown) => {
  return Object.prototype.toString.call(value) === '[object String]'
}
/**
 * 判断是否为数字
 * @param value
 * @return {boolean}
 */
export const isNumber = (value: unknown) => {
  return Object.prototype.toString.call(value) === '[object Number]'
}
/**
 * 判断值是否为JSON String
 * @param value
 * @return {boolean}
 */
export const isJson = (value: string) => {
  try {
    const obj = JSON.parse(value)
    return !!(typeof obj === 'object' && obj)
  } catch (e) {
    return false
  }
}
/**
 * 下载文件
 * @param href {String} base64地址或远程地址
 * @param filename {String} 文件名
 */
export const downloadFile = (href: string, filename: string) => {
  if (href && filename) {
    const a = document.createElement('a')
    a.download = filename // 指定下载的文件名
    a.href = href //  URL对象
    a.click() // 模拟点击
    URL.revokeObjectURL(a.href) // 释放URL 对象
  }
}
/**
 * 删除一条数据后返回下一条数据
 * @param itemList 列表
 * @param index 待删除数据
 * @return {{}}
 */
export const getNextItem = (itemList: IAnyObject[], index: number) => {
  let result = {}
  if (index === itemList.length - 1) {
    if (index !== 0) {
      result = itemList[index - 1]
    }
  } else {
    result = itemList[index + 1]
  }
  return result
}

/**
 * @description: 耗时格式化
 * @param {*} time 毫秒
 * @return {*} timeStr eg: 22时22分22秒
 */
export const durationTimeFormat = (time: number) => {
  if (!time && typeof time !== 'number') return ''
  const result = []
  const seconds = Math.ceil(time / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)
  if (years) {
    result.push(years + '年')
  }
  if (months % 12) {
    result.push(months % 12 + '月')
  }
  if (days % 365 % 30) {
    result.push(days % 365 % 30 + '天')
  }
  if (hours % 24) {
    result.push(hours % 24 + '小时')
  }
  if (minutes % 60) {
    result.push(minutes % 60 + '分')
  }
  if (seconds % 60) {
    result.push(seconds % 60 + '秒')
  }
  return result.join('')
}
/**
 * 根据url获取query中key对应的值
 * @param key
 * @param url
 * @return {string|null}
 */
export const getQueryString = (key: string, url: string) => {
  if (isEmpty(url)) url = window.location.href
  const reg = new RegExp('(^|&|\\?)' + key + '=([^&]*)(&|$|#)', 'i')
  const r = url.match(reg)
  if (r != null) return decodeURIComponent(r[2])
  return null
}
/**
 * 拼接url和query的值
 * @param url String
 * @param query Object
 * @return {string}
 */
export const setUrlQuery = (url: string, query: Record<string, string|number>) => {
  if (!url) return ''
  if (query) {
    const queryArray = []
    // eslint-disable-next-line
    for (const key in query) {
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        queryArray.push(`${key}=${query[key]}`)
      }
    }
    if (url.includes('?')) {
      url = `${url}&${queryArray.join('&')}`
    } else {
      url = `${url}?${queryArray.join('&')}`
    }
  }
  return url
}

export const getLabelByValue = (value: unknown, options: IAnyObject[], optionProps: {value: string, label: string}) => {
  return options.find(option => option[optionProps.value] === value)?.[optionProps.label]
}

type PropType<T, Path extends string> =
  string extends Path
    ? unknown
    :Path extends keyof T
      ? T[Path]
      : Path extends `${infer K}.${infer R}`
        ? K extends keyof T
          ? PropType<T[K], R>
          : unknown
        : unknown

type GetFieldValue<TObject, P extends string = string> = PropType<TObject, P>
export const getFieldValue = <TObject, P extends string>(target: TObject, propertyName: P): GetFieldValue<TObject, P> => {
  // @ts-ignore
  if (isNotEmpty(propertyName)) {
    const keys = propertyName.split('.')
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      // @ts-ignore
      if (i === keys.length - 1 && isNotEmpty(target[key])) {
        // @ts-ignore
        return target[keys[i]]
        // @ts-ignore
      } else if (isObject(target[keys[i]])) {
        // @ts-ignore
        target = target[keys[i]]
        // @ts-ignore
      } else if (isArray(target[keys[i]])) {
        // @ts-ignore
        if (isNaN(Number(keys[i]))) target = target[keys[i]]
      } else {
        // @ts-ignore
        return undefined
      }
    }
    return undefined as GetFieldValue<TObject, P>
  } else {
    // @ts-ignore
    return undefined as GetFieldValue<TObject, P>
  }
}

/**
 * 向对象添加一个property
 * @param target {Object} 目标对象
 * @param propertyName {String} 属性名
 * @param value {*}
 * @param hasArray {String}
 */
export const setFieldValue = <TObject, P extends string>(target: TObject, propertyName: P, value: GetFieldValue<TObject, P>, hasArray = false) => {
  if (isNotEmpty(propertyName)) {
    const keys = propertyName.split('.')
    const len = keys.length - 1
    keys.reduce((cur, key, index) => {
      if (index < len) {
        // @ts-ignore
        if (!cur[key]) {
          // 判断下一个key是否为数字
          if (hasArray && !isNaN(Number(keys[index + 1]))) {
            // @ts-ignore
            cur[key] = []
          } else {
            // @ts-ignore
            cur[key] = {}
          }
        }
      }
      if (index === len) {
        // @ts-ignore
        cur[key] = value
      }
      // @ts-ignore
      return cur[key]
    }, target)
  }
}

/**
 * 判断值是否为Map类型
 * @param value
 * @return {boolean}
 */
export const isMap = (value: unknown) => {
  return value instanceof Map
}
/**
 * 根据key获取mapping中的value
 * @param key
 * @param mapping
 * @return {*}
 */
export const getValueByKey = (key: string, mapping: IAnyObject | Map<unknown, unknown>) => {
  if (mapping instanceof Map) {
    return mapping.get(key)
  } else {
    return mapping[key]
  }
}
/**
 * 根据value获取mapping中的key
 * @param value
 * @param mapping
 * @return {string|*}
 */
export const getKeyByValue = (value: unknown, mapping: IAnyObject | Map<unknown, unknown>) => {
  if (mapping instanceof Map) {
    // eslint-disable-next-line no-unused-vars
    for (const [key, mapValue] of mapping) {
      if (mapValue === value) {
        return key
      }
    }
  } else {
    // eslint-disable-next-line no-unused-vars
    for (const key in mapping) {
      if (mapping[key] === value) {
        return key
      }
    }
  }
}

/**
 * 值根据映射关系和方向进行转换
 * @param value {*} 待转换值
 * @param mapping {Object} 映射关系
 * @param valueType {String} 转换方向 value-转为值 key-转为键
 */
export const getValueMapping = (value: unknown, mapping:IAnyObject | Map<unknown, unknown> = {}, valueType: 'value' | string) => {
  let result
  if (valueType === 'value') {
    // form 此时 value 为 value
    result = getKeyByValue(value, mapping)
    // Object.keys(mapping).forEach(key => {
    //   const mapValue = mapping[key]
    //   if (mapValue === value) {
    //     result = key
    //   }
    // })
    // 未找到映射关系返回原值
  } else {
    result = getValueByKey(value as string, mapping)
    // form 此时 value 为 key
    // const mapValue = mapping[value]
    // if (isNotEmpty(mapValue)) {
    //   result = mapValue
    // }
  }
  return result
}

type TTreeChildren<T, C> = C extends `${infer U}`
  ? U extends keyof T
    ? U
    : undefined
  : 'children'

export const depthFirstSearchTree = <
  T extends IAnyObject,
  K extends (keyof T & string),
  C extends string
>(
    tree: T,
    value: T[K],
    key: K,
    children: C = 'children' as C,
    depth = 0
  ): undefined | Omit<T, TTreeChildren<T, C>>[] => {
  depth++
  if (!tree) return
  if (getFieldValue(tree, key) === value) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const data = { ...tree }
    Reflect.deleteProperty(data, children)
    return [data] as T[]
  }
  // 最深至搜索10层
  if (depth > 9) return
  const treeChildren = tree[children] as (T[] | undefined)
  if (!treeChildren) return
  const loop = treeChildren.length
  for (let i = 0; i < loop; i++) {
    const result = depthFirstSearchTree(treeChildren[i], value, key, children, depth)
    if (result) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const data = { ...tree } as T
      Reflect.deleteProperty(data, children)
      result.unshift(data)
      return result
    }
  }
}

export const depthFirstSearchIndexTree = <T, K extends (keyof T & string), C extends (keyof T & string)>(
  tree: T[],
  value:T[K],
  key: K,
  children: C = 'children' as C,
  depth = 0
): undefined | number[] => {
  depth++
  if (!isArray(tree)) throw Error('tree must be array')
  if (tree.length === 0) return
  tree = ([] as T[]).concat(tree)
  const loop = tree.length
  for (let i = 0; i < loop; i++) {
    if (getFieldValue(tree[i], key) === value) {
      return [i]
    }
    if (depth > 9) continue // 超过9层时不在向下查找
    const childrenTree = getFieldValue(tree[i], children)
    if (!childrenTree) continue
    const result = depthFirstSearchIndexTree(childrenTree as T[], value, key, children, depth)
    if (result) {
      result.unshift(i)
      return result
    }
  }
}
export const getPropertyKeyByPath = (path: number[], treeProps: { children: string }) => {
  const { children } = treeProps
  return path.join(`.${children}.`)
}
export const getUsingConfig = (...args: unknown[]) => {
  for (let i = 0; i < args.length; i++) {
    const value = args[i]
    if (isNotEmpty(value)) {
      return value
    }
  }
}
/**
 * 判断当前处于什么设备中
 */
export const getEquipmentType = () => {
  if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i))) {
    return 'mobile'
  } else {
    return 'pc'
  }
}
/**
 * 数字添加千分位分隔符
 * @param {Number} number 数字
 * @param {String} separator 分隔符
 * @return {string}
 */
export const addThousandSeparator = (number: number, separator = ''): string => {
  const arr = (number + '').split('.')
  arr[0] = arr[0].replace(/(\d)(?=(?:\d{3})+$)/g, `$1${separator}`)
  return arr.join('.')
}

export const getValueByTemplate = (template: unknown, object: Record<string, unknown>) => {
  // 不能完全匹配template的数据 直接返回原始值
  if (typeof template !== 'string') {
    return template
  }
  return template?.replace(/\${([^}]+)}/g, (_, key: string) => {
    const val = getFieldValue(object, key) as string | undefined
    return isNotEmpty(val) ? val! : `\${${key}}`
  })
}

export class Strategy {
  strategies:Record<string, (...args: unknown[])=>void> = {}
  message: string = ''
  constructor ({ strategies, message }: {strategies?: Record<string, (...args: unknown[])=>void>, message?: string} = {}) {
    this.strategies = strategies || {}
    this.message = message ?? ''
  }

  setStrategy (type: string, strategy: ()=> void) {
    this.strategies[type] = strategy
  }

  execute (type: string, ...args: unknown[]) {
    if ((!type || !this.strategies[type])) {
      throw Error(this.message)
    }
    this.strategies[type](...args)
  }
}

export const subStr = (string: unknown, start: number, end: number) => {
  if (typeof string !== 'string') {
    throw Error('param is not string')
  }
  if (end < 0) {
    const len = string.length
    if (len + end <= 0) return ''
    end = len + end
  }
  return string.substring(start, end)
}
