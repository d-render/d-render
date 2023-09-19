import { ref, computed, watch, toRef, Ref, ComputedRef } from 'vue'
import { getFieldValue, IAnyObject, IRenderConfig } from '@d-render/shared'
import { getChangeIndex, getValuesByKeys, IKey } from '../util'
import type { FormItemProps } from '../index'
// 监听数据变化，处理变化的数据后再执行
export const useFieldChange = (props: FormItemProps,
  securityConfig: Ref<IRenderConfig>,
  dependOnWatchCb: (
    { changeKeys, changeOldValues }: {changeKeys: Array<IKey>, changeOldValues: Array<unknown> },
    { values, outValues, executeChangeValueEffect }: {values: IAnyObject, outValues: IAnyObject, executeChangeValueEffect: boolean}
  )=> void) => {
  const changeCount = ref(0)
  const dependOnValues:Ref<IAnyObject> = ref({})
  const outDependOnValues:Ref<IAnyObject> = ref({})
  const tableDependOnValues = toRef(props, 'tableDependOnValues') as Ref<IAnyObject>
  const model = toRef(props, 'model')
  const dependOn:ComputedRef<Array<IKey>> = computed(() => securityConfig.value.dependOn || [])
  const outDependOn:ComputedRef<Array<IKey>> = computed(() => securityConfig.value.outDependOn || [])
  const depend = props.inTable ? dependOn.value.concat(outDependOn.value) : dependOn.value

  const generateWatchValue = () => {
    let result = watchValue(model, dependOn.value)
    if (props.inTable) {
      result = result.concat(watchValue(tableDependOnValues, outDependOn.value))
    }
    return result
  }

  const filterSelf = (dependOn: Array<IKey>) => {
    return dependOn.filter(key => {
      if (typeof key === 'object') key = key.key
      return key !== props.fieldKey
    })
  }

  const watchValue = (target: Ref<IAnyObject>, dependOn: Array<IKey>) => filterSelf(dependOn)
    .map(key => {
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
  const collectDependInfo = () => {
    const values = getValuesByKeys(model.value, dependOn.value)
    const outValues = getValuesByKeys(tableDependOnValues.value, outDependOn.value)
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
      // 如果不过滤自己的话获取到的changeKeys可能存在错位的问题
      const change = getChange(values, oldValues, filterSelf(depend))
      // 相同的对象 判断存在数据变化才触发依赖值更新
      collectDependInfo() // 此处需要获取所有的数据
      dependOnWatchCb(change, {
        executeChangeValueEffect: securityConfig.value.immediateChangeValue || !firstChange,
        values: dependOnValues.value,
        outValues: outDependOnValues.value
      })
      firstChange = false
    }, { deep: true, immediate: true, flush: 'post' })
  }
  return {
    changeCount, dependOnValues, outDependOnValues
  }
}
