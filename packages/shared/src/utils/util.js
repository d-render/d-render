import lodashCloneDeep from 'lodash-es/cloneDeep'

/**
 * @function 深拷贝
 * @param value {*}
 * @return {*}
 */
export const cloneDeep = (value) => {
  return lodashCloneDeep(value)
}
/**
 * @function 2个对象值进行比较
 * @param objectA
 * @param objectB
 * @return {boolean}
 */
export const objectEqual = (objectA = {}, objectB = {}) => {
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
      if (!objectEqual(valueA, valueB)) return false
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
export function throttle (fn, delay) {
  let pre = 0
  return function () {
    const args = arguments
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
export const debounce = (fn, wait, immediate) => {
  let timeout, result
  const debounced = function () {
    const context = this
    const args = arguments
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      // 如果已经执行过，不再执行
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) result = fn.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        fn.apply(context, args)
      }, wait)
    }
    return result
  }
  debounced.cancel = () => {
    clearTimeout(timeout)
    timeout = null
  }
  return debounced
}

/**
 * 大写第一位字符串
 * @param str {String} 字符串
 * @return {string}
 */
export const toUpperFirstCase = (str) => {
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
export const toTreeData = (list, parentKey = 'parentId', root = 0) => {
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
export const isEmpty = (value) => {
  return value === undefined || value === null
}
/**
 * 判断值是否为undefined或null或空字符串
 * @param value {*} 待判断值
 * @return {boolean}
 */
export const isInputEmpty = (value) => {
  return value === undefined || value === null || value === ''
}
/**
 * 判断值是否不为undefined或null
 * @param value {*} 待判断值
 * @return {boolean}
 */
export const isNotEmpty = (value) => {
  return !isEmpty(value)
}
/**
 * 是否为没有空对象
 * @param value {Object} 待判断对象
 * @return {boolean}
 */
export const isEmptyObject = (value) => {
  return Object.keys(value).length === 0
}
/**
 * 判断值是否为数组
 * @param value {*}
 * @return {boolean}
 */
export const isArray = (value) => {
  return Object.prototype.toString.call(value) === '[object Array]'
}
/**
 * 判断是否对象
 * @param value
 * @return {boolean}
 */
export const isObject = (value) => {
  return Object.prototype.toString.call(value) === '[object Object]'
}
/**
 * 判断是否为字符串
 * @param value
 * @return {boolean}
 */
export const isString = (value) => {
  return Object.prototype.toString.call(value) === '[object String]'
}
/**
 * 判断是否为数字
 * @param value
 * @return {boolean}
 */
export const isNumber = (value) => {
  return Object.prototype.toString.call(value) === '[object Number]'
}
/**
 * 判断值是否为JSON String
 * @param value
 * @return {boolean}
 */
export const isJson = (value) => {
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
export const downloadFile = (href, filename) => {
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
export const getNextItem = (itemList, index) => {
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
export const durationTimeFormat = (time) => {
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
export const getQueryString = (key, url) => {
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
export const setUrlQuery = (url, query) => {
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

export const getLabelByValue = (value, options, optionProps) => {
  return options.find(option => option[optionProps.value] === value)?.[optionProps.label]
}

export const getFieldValue = (target, propertyName) => {
  if (isNotEmpty(propertyName)) {
    const keys = propertyName.split('.')
    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1 && isNotEmpty(target[keys[i]])) {
        return target[keys[i]]
      } else if (isObject(target[keys[i]])) {
        target = target[keys[i]]
      } else if (isArray(target[keys[i]])) {
        if (isNaN(Number(keys[i]))) target = target[keys[i]]
      } else {
        return undefined
      }
    }
  } else {
    return undefined
  }
}
/**
 * 向对象添加一个property
 * @param target {Object} 目标对象
 * @param propertyName {String} 属性名
 * @param value
 */
export const setFieldValue = (target, propertyName, value, hasArray = false) => {
  if (isNotEmpty(propertyName)) {
    const keys = propertyName.split('.')
    const len = keys.length - 1
    keys.reduce((cur, key, index) => {
      if (index < len) {
        if (!cur[key]) {
          // 判断下一个key是否为数字
          if (hasArray && !isNaN(Number(keys[index + 1]))) {
            cur[key] = []
          } else {
            cur[key] = {}
          }
        }
      }
      if (index === len) {
        cur[key] = value
      }
      return cur[key]
    }, target)
  }
}
/**
 * 判断值是否为Map类型
 * @param value
 * @return {boolean}
 */
const isMap = (value) => {
  return value instanceof Map
}
/**
 * 根据key获取mapping中的value
 * @param key
 * @param mapping
 * @return {*}
 */
export const getValueByKey = (key, mapping) => {
  if (isMap(mapping)) {
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
export const getKeyByValue = (value, mapping) => {
  if (isMap(mapping)) {
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
 * @param type {String} 转换方向 form-转为值 to-转为键
 */
export const getValueMapping = (value, mapping = {}, valueType) => {
  let result
  if (valueType === 'value') {
    // form 此时 value 为 value
    Object.keys(mapping).forEach(key => {
      const mapValue = mapping[key]
      if (mapValue === value) {
        result = key
      }
    })
    // 未找到映射关系返回原值
  } else {
    // form 此时 value 为 key
    const mapValue = mapping[value]
    if (isNotEmpty(mapValue)) {
      result = mapValue
    }
  }
  return result
}

export const depthFirstSearchTree = (tree, value, key, children = 'children', depth = 0) => {
  depth++
  if (!tree) return
  if (getFieldValue(tree, key) === value) {
    const { children, ...useObject } = tree
    return [useObject]
  }
  // 最深至搜索10层
  if (depth > 9) return
  if (!tree[children]) return
  const loop = tree[children].length
  for (let i = 0; i < loop; i++) {
    const result = depthFirstSearchTree(tree[children][i], value, key, children, depth)
    if (result) {
      const { children, ...useObject } = tree
      result.unshift(useObject)
      return result
    }
  }
}
export const depthFirstSearchIndexTree = (tree, value, key, children = 'children', depth = 0) => {
  depth++
  if(!isArray(tree)) throw Error('tree must be array')
  if (tree.length === 0) return
  tree = [].concat(tree)
  const loop = tree.length
  for(let i = 0; i < loop; i++){
    if(getFieldValue(tree[i], key) === value){
      return [i]
    }
    if (depth > 9) continue // 超过9层时不在向下查找
    const childrenTree = getFieldValue(tree[i], children)
    if(!childrenTree) continue
    const result = depthFirstSearchIndexTree(childrenTree, value, key, children, depth)
    if (result) {
      result.unshift(i)
      return result
    }
  }
}
export const getPropertyKeyByPath = (path, treeProps) => {
  const { children } = treeProps
  return path.join(`.${children}.`)
}
export const getUsingConfig = (...args) => {
  for (let i = 0; i < args.length; i++) {
    const value = args[i]
    if (isNotEmpty(value)) {
      return value
    }
  }
}

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
export const addThousandSeparator = (number, separator = '') => {
  const arr = (number + '').split('.')
  arr[0] = arr[0].replace(/(\d)(?=(?:\d{3})+$)/g, `$1${separator}`)
  return arr.join('.')
}

export const getValueByTemplate = (template, object) => {
  // 不能完全匹配template的数据 直接返回原始值
  if (typeof template !== 'string') {
    return template
  }
  return template?.replace(/\${([^}]+)}/g, (_, key) => {
    const val = getFieldValue(object, key)
    return isNotEmpty(val) ? val : `\${${key}}`
  })
}

export class Strategy {
  strategies = {}
  message = ''
  constructor ({ strategies, message } = {}) {
    this.strategies = strategies || {}
    this.message = message
  }

  setStrategy (type, strategy) {
    this.strategies[type] = strategy
  }

  execute (type, ...args) {
    if ((!type || !this.strategies[type])) {
      throw Error(this.message)
    }
    this.strategies[type](...args)
  }
}

export const subStr = (string, start, end)=> {
  if(typeof string !== 'string'){
    throw Error('param is not string')
  }
  if(end < 0){
    const len = string.length
    if(len + end <= 0) return ''
    end = len + end
  }
  return string.substring(start,end)
}
