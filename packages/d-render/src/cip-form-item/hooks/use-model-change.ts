import { computed, ComputedRef, readonly, Ref } from 'vue'
import {
  getFieldValue,
  isArray,
  isEmpty,
  isNotEmpty,
  setFieldValue,
  emptySign, IAnyObject, IRenderConfig
} from '@d-render/shared'
import { getValuesByKeys, UpdateModelQueue } from '../util'
export const useFieldValue = (
  key: Ref<Array<string>|string|unknown>,
  model: Ref<IAnyObject>,
  updateModelQueue: UpdateModelQueue,
  changeEffect?: ComputedRef<IRenderConfig['changeEffect']>
) => {
  const isArrayKey = computed(() => {
    return isArray(key.value)
  })
  const value = computed(() => {
    if (!key.value || (key.value as Array<string>).length === 0) return undefined
    // 根据key的类型不同调用不同的方法获取otherValue
    if (isArrayKey.value) {
      return getValuesByKeys(model.value, key.value as Array<string>)
    } else {
      return getFieldValue(model.value, key.value as string)
    }
  })
  const updateValue = async (val: unknown) => {
    if (!key.value) return
    if (changeEffect?.value) { // TODO: 需要区分otherKey和fieldKey,目前otherKey不支持changeEffect
      try {
        const result = await changeEffect.value(val, key.value as string, model.value)
        if (result === false) throw new Error('changeEffect false interrupted data update')
      } catch (e) {
        throw new Error('changeEffect reject interrupted data update')
      }
    }
    if (isArrayKey.value) {
      (key.value as Array<string>).forEach(k => {
        // 如果otherKey是输出， 在设置undefined是将导致报错,故使用默认空对象进行防御
        updateModelQueue.append(k, getFieldValue(val || {}, k))
      })
    } else {
      updateModelQueue.append(key.value as string, val)
    }
  }
  return [value, updateValue] as [ComputedRef<unknown>, (val: unknown)=> Promise<void> ]
}

export const useSteamUpdateValues = (
  fieldKey:Ref<string>,
  otherKey:Ref<string|Array<string>|undefined>,
  model: Ref<IAnyObject>,
  updateModel: (value: IAnyObject)=> void,
  changeEffect: ComputedRef<IRenderConfig['changeEffect']>
) => {
  const keys = computed(() => {
    let result = ([] as Array<string>).concat(fieldKey.value)
    if (otherKey.value !== undefined) {
      result = result.concat(otherKey.value)
    }
    return result
  })
  const values = computed(() => {
    return keys.value.map(key => getFieldValue(model.value, key))
  })
  const streamUpdateModel = async (values: Array<unknown | symbol>) => {
    console.log('values', values)
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
        setFieldValue(innerModel, key, undefined, true)
      } else if (!isEmpty(value)) {
        setFieldValue(innerModel, key, values[index], true)
      }
    })
    updateModel(innerModel)
  }
  const clearValues = () => {
    const innerModel = model.value // 不能结构，结构将导致监听到整个model数据的变化
    keys.value.forEach((key) => {
      setFieldValue(innerModel, key, undefined, true)
    })
  }
  return {
    values,
    streamUpdateModel,
    clearValues
  }
}
