
  type AnyFunction = (...args:any[])=> any
  export type IAnyObject = {[propname: string]: any}
  // 深拷贝
  export function cloneDeep<T=any>(params: T): T

  // 2个对象值进行比较
  export function objectEqual(objectA: Record<any, any>, objectB:  Record<any, any>): boolean

  // 节流
  export function throttle (fn: AnyFunction, delay: number): AnyFunction

  // 防抖
  export function debounce(fn: AnyFunction, wait: number, immediate: boolean): AnyFunction

  // 大写第一位字符
  export function toUpperFirstCase(str: string): string

  // 平铺数组转换为树状结构
  export function toTreeData(list: any[], parentKey?: string, root?: number): boolean

  // 判断值是否为undefined或null
  export function isEmpty(value: any): boolean

  // 判断值是否为undefined或null或空字符串
  export function isInputEmpty(value: any): boolean

  // 判断值是否不为undefined或null
  export function isNotEmpty(value: any): boolean

  // 是否为没有空对象
  export function isEmptyObject(value: any): boolean

  // 判断值是否为数组
  export function isArray(value: any): boolean

  // 判断是否对象
  export function isObject(value: any): boolean

  // 判断是否为字符串
  export function isString(value: any): boolean

  // 判断是否为数字
  export function isNumber(value: any): boolean

  // 判断值是否为JSON String
  export function isJson(value: any): boolean

  // 判断值是否为Map类型
  export function isMap(value: any): boolean

  // 下载文件
  export function downloadFile(href: string, filename: string): void

  // 返回下一条数据
  export function getNextItem<T>(itemList: T[], index: number): T

  // 耗时格式化
  export function durationTimeFormat(ms: number): string

  // 根据url获取query中key对应的值
  export function getQueryString(key: string, url: string): string | null

  // 拼接url和query的值
  export function setUrlQuery(url: string, query: string): string

  // 根据 label获取 value
  interface IOptionProps {
    label: string, // label键值
    value: string // value键值
  }
  export function getLabelByValue(value: any, options: any[], optionProps: IOptionProps): string

  export function getFieldValue(target: Record<string, any>, propertyName: string): any

  // 向对象添加一个property
  export function setFieldValue(target: Record<string, any>, propertyName: string, value: any, hasArray?: boolean): void

  // 根据key获取mapping中的value
  export function getValueByKey(key: any, mapping: Map<any, any>): any

  // 根据value获取mapping中的key
  export function getKeyByValue(value: any, mapping: Map<any, any>): any

  // 值根据映射关系和方向进行转换
  export function getValueMapping(value: any, mapping: Record<string, any>, valueType?: 'value'| 'key'): any

  export function depthFirstSearchTree(tree: Record<string, any>, value: any, key: string, children?: string , depth?: number): Record<string, any>

  export function depthFirstSearchIndexTree(tree: Array<Record<string, any>>, value: any, key: string, children?: string , depth?: number): Array<number>

  export function getPropertyKeyByPath(path: Array<number>, treeProps: {children: string, [propname: string]: any}): string
  export function getUsingConfig<T>(...arg: T[]): T

  export function getEquipmentType(): 'mobile' | 'pc'

  // 数字添加千分位分隔符
  export function addThousandSeparator(number: number, separator?: string): string

  export function getValueByTemplate<T=any>(template: string, object: Record<string, T>): T

  export class Strategy{
    strategies: Record<string, (type: string, ...args:any[])=>void>
    message: string
    constructor({strategies: IAnyObject, message: string})
    setStrategy(type: string, strategy: (type: string, ...args:any[])=>void): void
    execute(type: string, ...args: any[]): void
  }

  export function subStr (string: string, start: number, end?: number): string
