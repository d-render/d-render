import { unref } from 'vue'
import { getFieldValue, isNotEmpty, setFieldValue, DRender } from '@d-render/shared'

export const getValuesByKeys = (data = {}, keys = []) => {
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

export const setValuesByKeys = (target = {}, keys = [], values = {}) => {
  keys.forEach((key) => {
    if (typeof key === 'object') {
      const object = key
      setFieldValue(target, object.key, getFieldValue(values, object.key), true)
    } else {
      setFieldValue(target, key, getFieldValue(values, key), true)
    }
  })
}

export const isHideLabel = (config) => {
  return (
    config.hideLabel ||
    (isNotEmpty(config.labelWidth) && !config.labelWidth) ||
    !config.label
  )
}

export const getLabelWidth = (config) => {
  if (config.hideLabel) return '0px'
  if (isNotEmpty(config.labelWidth)) {
    if (isNaN(config.labelWidth)) return config.labelWidth
    return config.labelWidth + 'px'
  }
  if (!config.label) return '0px' // 兼容老的设计
  return undefined
}
export const getChangeIndex = (values, oldValues) => {
  const result = []
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

export const secureNewFn = (...params) => {
  const funcBody = params.pop()
  try {
    // eslint-disable-next-line no-new-func
    return new Function(...params, funcBody)
  } catch (error) {
    console.error(error)
    return () => {}
  }
}
export const judgeUseFn = (key, config, effect) => {
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
  constructor (getModel, updateModel) {
    this.getModel = getModel
    this.updateModel = updateModel
  }

  init () {
    this.data = new Map()
  }

  append (key, value) {
    if (!this.isCollect) {
      this.init()
      this.isCollect = true
      // setTimeout(() => {
      // }, 20)
    }
    this.data.set(key, value) // = value
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

const dRender = new DRender()
export const getInputComponent = (type) => {
  return dRender.getComponent(type)
}

export const getViewComponent = (type) => {
  return dRender.getComponent(type, 'view')
}

export const getH5InputComponent = (type) => {
  return dRender.getComponent(type, 'mobile')
}
