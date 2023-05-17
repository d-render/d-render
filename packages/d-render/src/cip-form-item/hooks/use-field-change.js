import { ref, computed, watch, toRef } from 'vue'
import { getFieldValue } from '@d-render/shared'
import { getChangeIndex, getValuesByKeys } from '../util'

// 监听数据变化，处理变化的数据后再执行
export const useFieldChange = (props, securityConfig, dependOnWatchCb) => {
  const changeCount = ref(0)
  const dependOnValues = ref([])
  const outDependOnValues = ref([])
  const tableDependOnValues = toRef(props, 'tableDependOnValues')
  const model = toRef(props, 'model')
  const dependOn = computed(() => securityConfig.value.dependOn || [])
  const outDependOn = computed(() => securityConfig.value.outDependOn || [])
  const depend = props.inTable ? dependOn.value.concat(outDependOn.value) : dependOn.value

  const generateWatchValue = () => {
    let result = watchValue(model, dependOn.value)
    if (props.inTable) {
      result = result.concat(watchValue(tableDependOnValues, outDependOn.value))
    }
    return result
  }

  const filterSelf = (dependOn) => {
    return dependOn.filter(key => {
      if (typeof key === 'object') key = key.key
      return key !== props.fieldKey
    })
  }

  const watchValue = (target, dependOn) => filterSelf(dependOn)
    .map(key => {
      if (typeof key === 'object') key = key.key
      return () => getFieldValue(target.value, key)
    })

  const getChange = (values, oldValues, depend) => { // 转为纯函数
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
    let unwatch
    watch(model, () => {
      changeCount.value++ // 增加一个model变化计数器
      // 重新开启监听
      if (unwatch) unwatch() // model变化时重新开启监听
      let firstChange = true
      // 监听时需要排除掉自己
      unwatch = watch(generateWatchValue(dependOn, outDependOn), (values, oldValues) => {
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
      }, { deep: true, immediate: true })
    }, { immediate: true })
  }
  return {
    changeCount, dependOnValues, outDependOnValues
  }
}
