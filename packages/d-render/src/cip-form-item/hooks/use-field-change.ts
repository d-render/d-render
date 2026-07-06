import { ref, computed, watch, toRef, Ref, ComputedRef } from 'vue'
import { getFieldValue, setFieldValue, IAnyObject, TFormConfig } from '@d-render/shared'
import { getChangeIndex, getValuesByKeys, IKey } from '../util'
import type { FormItemProps } from '../index'
// 监听数据变化，处理变化的数据后再执行
export const useFieldChange = (props: FormItemProps,
  securityConfig: ComputedRef<TFormConfig>,
  dependOnWatchCb: (
    { changeKeys, changeOldValues }: {changeKeys: Array<IKey>, changeOldValues: Array<unknown> },
    { values, outValues, executeChangeValueEffect, dependOldValues }: {values: IAnyObject, outValues: IAnyObject, executeChangeValueEffect: boolean, dependOldValues: IAnyObject}
  )=> void) => {
  const changeCount = ref(0)
  const dependOnValues:Ref<IAnyObject> = ref({})
  const outDependOnValues:Ref<IAnyObject> = ref({})
  // dependOn各字段变化前的完整旧值快照，供changeValueByOld判断增减场景使用
  const dependOldValues:Ref<IAnyObject> = ref({})
  const tableDependOnValues = toRef(props, 'tableDependOnValues') as Ref<IAnyObject>
  const parentDependOnValues = toRef(props, 'parentDependOnValues') as Ref<IAnyObject>
  const model = toRef(props, 'model')
  const dependOn:ComputedRef<Array<IKey>> = computed(() => securityConfig.value.dependOn as IKey[] || [])
  const outDependOn:ComputedRef<Array<IKey>> = computed(() => securityConfig.value.outDependOn || [])
  const filterSelf = (dependOn: Array<IKey>) => {
    return dependOn.filter(key => {
      if (typeof key === 'object') key = key.key
      return key !== props.fieldKey
    })
  }
  // 保持depend和generateWatchValue中的key一致
  // 2023-12-13 仅过滤dependOn对自己的依赖
  const depend = (props.inTable || props.inParent)
    ? filterSelf(dependOn.value).concat(outDependOn.value)
    : filterSelf(dependOn.value)
  const generateWatchValue = () => {
    let result = watchValue(model, filterSelf(dependOn.value))
    // inTable将逐渐放弃
    // [FIX]: 2023-12-13修复outDepend无法依赖与自己一样key的数据
    if (props.inTable) {
      result = result.concat(watchValue(tableDependOnValues, outDependOn.value))
    }
    if (props.inParent) {
      result = result.concat(watchValue(parentDependOnValues, outDependOn.value))
    }
    return result
  }

  const watchValue = (target: Ref<IAnyObject>, dependOn: Array<IKey>) => dependOn.map(key => {
    if (typeof key === 'object') key = key.key
    return () => getFieldValue(target.value, key as string)
  })

  const getChange = (values: Array<unknown>, oldValues: Array<unknown>, depend: Array<IKey>) => { // 转为纯函数
    const changeIndex = getChangeIndex(values, oldValues)
    const changeValue = changeIndex.map(index => values[index])
    const changeOldValues = changeIndex.map(index => oldValues[index])
    const changeKeys = changeIndex.map(index => depend[index]) // 此处depend为函数私有
    return { changeValue, changeOldValues, changeKeys }
  }
  // 依据key列表与对应位置的值数组，还原出完整的{key: value}快照
  const buildValuesByKeys = (keys: Array<IKey>, arr: Array<unknown>) => {
    const result: IAnyObject = {}
    keys.forEach((key, index) => {
      const k = typeof key === 'object' ? key.key : key
      setFieldValue(result, k as string, arr[index], true)
    })
    return result
  }
  const collectDependInfo = () => {
    const values = getValuesByKeys(model.value, dependOn.value)
    // const outValues = getValuesByKeys(tableDependOnValues.value, outDependOn.value)
    let outValues = {}
    if (props.inTable) {
      outValues = getValuesByKeys(tableDependOnValues.value, outDependOn.value)
    }
    if (props.inParent) {
      outValues = getValuesByKeys(parentDependOnValues.value, outDependOn.value)
    }
    dependOnValues.value = values
    outDependOnValues.value = outValues
  }
  if (depend.length > 0) {
    let firstChange: boolean
    watch(() => props.model, () => {
      changeCount.value++ // 增加一个model变化计数器
      firstChange = true
    }, { deep: false, immediate: true })
    // 监听时需要排除掉自己
    watch(generateWatchValue(), (values, oldValues) => {
      const change = getChange(values, oldValues, depend)
      // 相同的对象 判断存在数据变化才触发依赖值更新
      collectDependInfo() // 此处需要获取所有的数据
      // depend末尾可能追加了outDependOn(inTable/inParent场景)，这里只截取dependOn自身对应的旧值部分
      const dependOnKeys = filterSelf(dependOn.value)
      dependOldValues.value = buildValuesByKeys(dependOnKeys, oldValues.slice(0, dependOnKeys.length))
      dependOnWatchCb(change, {
        executeChangeValueEffect: securityConfig.value.immediateChangeValue || !firstChange,
        values: dependOnValues.value,
        outValues: outDependOnValues.value,
        dependOldValues: dependOldValues.value
      })
      firstChange = false
    }, { deep: true, immediate: true, flush: 'post' })
  }
  return {
    changeCount, dependOnValues, outDependOnValues, dependOldValues
  }
}
