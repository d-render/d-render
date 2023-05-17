import { computed, readonly } from 'vue'
import {
  getFieldValue,
  isArray,
  isEmpty,
  isNotEmpty,
  setFieldValue,
  emptySign
} from '@d-render/shared'
import { getValuesByKeys } from '../util'
export const useFieldValue = (key, model, updateModelQueue, changeEffect) => {
  const isArrayKey = computed(() => {
    return isArray(key.value)
  })
  const value = computed(() => {
    if (!key.value || key.value.length === 0) return undefined
    // 根据key的类型不同调用不同的方法获取otherValue
    if (isArrayKey.value) {
      return getValuesByKeys(model.value, key.value)
    } else {
      return getFieldValue(model.value, key.value)
    }
  })
  const updateValue = async (val) => {
    if (!key.value) return
    if (changeEffect?.value) { // TODO: 需要区分
      try {
        const result = await changeEffect.value(val, key.value, model.value)
        if (result === false) throw new Error('changeEffect false interrupted data update')
      } catch (e) {
        throw new Error('changeEffect reject interrupted data update')
      }
    }
    if (isArrayKey.value) {
      key.value.forEach(k => {
        // 如果otherKey是输出， 在设置undefined是将导致报错,故使用默认空对象进行防御
        updateModelQueue.append(k, getFieldValue(val || {}, k))
      })
    } else {
      updateModelQueue.append(key.value, val)
    }
  }
  return [value, updateValue]
}

export const useSteamUpdateValues = (fieldKey, otherKey, model, updateModel, changeEffect) => {
  const keys = computed(() => {
    return [].concat(fieldKey.value).concat(otherKey.value)
  })
  const values = computed(() => {
    return keys.value.map(key => getFieldValue(model.value, key))
  })
  const streamUpdateModel = async (values) => {
    console.log('streamUpdateModel', values)
    if (changeEffect?.value && isNotEmpty(values[0])) {
      let value = values[0]
      if (values[0] === emptySign) value = undefined
      try {
        const result = await changeEffect.value(value, keys.value[0], readonly(model.value))
        if (result === false) throw new Error('changeEffect false interrupted data update')
      } catch (e) {
        throw new Error('changeEffect reject interrupted data update')
      }
    }
    const innerModel = model.value // 不能结构，结构将导致监听到整个model数据的变化
    keys.value.forEach((key, index) => {
      const value = values[index]
      if (value === emptySign) {
        setFieldValue(innerModel, key, undefined)
      } else if (!isEmpty(value)) {
        setFieldValue(innerModel, key, values[index])
      }
    })
    updateModel(innerModel)
  }
  const clearValues = () => {
    const innerModel = model.value // 不能结构，结构将导致监听到整个model数据的变化
    keys.value.forEach((key) => {
      setFieldValue(innerModel, key, undefined)
    })
  }
  return {
    values,
    streamUpdateModel,
    clearValues
  }
}
