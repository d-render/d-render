import { unref, Ref } from 'vue'
import { getFieldValue, isNotEmpty, setFieldValue, cloneDeep, IAnyObject, IRenderConfig, IRenderConfigDependOn } from '@d-render/shared'

interface IEffectFunc {
  value: (...args: Array<unknown>) => unknown | Promise<unknown>
}
interface IEffect{
  [key: string]: string | IEffectFunc
}

export type IObjectKey = IRenderConfigDependOn

export type IKey = IObjectKey | string

export const getValuesByKeys = (data: IAnyObject = {}, keys:Array<IKey> = []) => {
  const result = {}
  keys.forEach((key) => {
    if (typeof key === 'object') {
      const object = key
      setFieldValue(result, object.key, getFieldValue(data, object.key), true)
    } else {
      setFieldValue(result, key, getFieldValue(data, key), true)
    }
  })
  return result
}

export const setValuesByKeys = (target:IAnyObject = {}, keys:Array<IKey> = [], values: IAnyObject = {}) => {
  keys.forEach((key) => {
    if (typeof key === 'object') {
      const object = key
      setFieldValue(target, object.key, getFieldValue(values, object.key), true)
    } else {
      setFieldValue(target, key, getFieldValue(values, key), true)
    }
  })
}
// 去除对象的指定属性后返回去除属性的集合仅适用于单层对象
const filterProperty = (object: IAnyObject, properties: Array<string>) => {
  // 进行一次浅拷贝防止deleteProperty删除修改原始对象
  const newObject = { ...object }
  const omitObject = properties.reduce((acc: Record<string, unknown>, key) => {
    const v = object[key]
    Reflect.deleteProperty(object, key)
    acc[key] = v
    return acc
  }, {})
  return [newObject, omitObject]
}
// 深克隆非指定属性
export const cloneDeepConfig = (config: IRenderConfig) => {
  // const fixedKeys = ['dependOn', 'changeConfig', 'changeValue', 'changeValueByOld', 'outDependOn', 'asyncOptions', '$render']
  // const [volatileConfig, fixedConfig] = filterProperty(config, fixedKeys)
  // const newConfig =
  return cloneDeep(config)
}

export const isHideLabel = (config: IRenderConfig) => {
  return (
    config.hideLabel ||
    (isNotEmpty(config.labelWidth) && !config.labelWidth) ||
    !config.label
  )
}

export const getLabelWidth = (config: IRenderConfig) => {
  if (config.hideLabel) return '0px'
  if (isNotEmpty(config.labelWidth)) {
    if (isNaN(config.labelWidth as number)) return config.labelWidth as string
    return config.labelWidth + 'px'
  }
  if (!config.label) return '0px' // 兼容老的设计
  return undefined
}
export const getChangeIndex = (values: Array<unknown>, oldValues: Array<unknown>) => {
  const result: Array<number> = []
  values.forEach((v, i) => {
    if (typeof v === 'object') {
      // 数组 对象相等判断
      // 无法通过值来判断对象级数组是否变化 (地址引用导致2个值一直都是相等的)
      result.push(i)
    } else {
      if (v !== oldValues[i]) {
        result.push(i)
      }
    }
  })
  return result
}

export const secureNewFn = (...params: Array<string>) => {
  const funcBody = params.pop()
  try {
    // eslint-disable-next-line no-new-func
    return new Function(...params, funcBody as string)
  } catch (error) {
    console.error(error)
    return () => {}
  }
}

export const judgeUseFn = (key: string, config: IRenderConfig, effect: IEffect) => {
  // console.log(key, config, effect);
  // eslint-disable-next-line no-new-func
  if (key === 'changeValue' && config.changeValueStr) {
    return secureNewFn(
      'dependOnValues',
      'outDependOnValues',
      config.changeValueStr
    )
  }
  if (key === 'changeConfig' && config.changeConfigStr) {
    return secureNewFn(
      'config',
      'dependOnValues',
      'outDependOnValues',
      config.changeConfigStr
    )
  }
  // 对asyncOptions的特殊处理
  if (key === 'asyncOptions' && typeof config.asyncOptions === 'string') { return secureNewFn('dependOnValues', 'outDependOnValues', config.asyncOptions) }
  if (!effect) return config[key] // 没有effect 参数则直接使用config[key]
  if (effect && key in effect) {
    // 有effect 且 effect对象明确存在key(不管其值为什么)
    if (typeof effect[key] === 'function') return effect[key] // effect中的值为函数 则认为此次响应使用局部方法
    return config[key]
  }
}

export class UpdateModelQueue {
  getModel: () => IAnyObject | Ref<IAnyObject>
  updateModel: (value: IAnyObject) => void
  data: Map<string, unknown> = new Map()
  isCollect?: boolean
  constructor (getModel: () => IAnyObject | Ref<IAnyObject>, updateModel: (value: IAnyObject) => void) {
    this.getModel = getModel
    this.updateModel = updateModel
  }

  init () {
    this.data = new Map()
  }

  append (key: string, value: unknown) {
    if (!this.isCollect) {
      this.init()
      this.isCollect = true
      // setTimeout(() => {
      // }, 20)
    }
    this.data?.set(key, value) // = value
    this.update() // 直接触发
    // setFieldValue(this.data, key, value)
  }

  update () {
    const model = unref(this.getModel()) // 维持model是最新的
    // eslint-disable-next-line no-unused-vars
    for (const key of this.data.keys()) {
      const value = this.data.get(key)
      setFieldValue(model, key, value, true)
    }
    this.isCollect = false
    this.updateModel(model)
  }
}
