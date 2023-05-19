import { computed, ref } from 'vue'
import { cloneDeep, getFieldValue } from '@d-render/shared'
import { EffectExecutor } from '../effect-executor'
import { useFieldChange } from './use-field-change'
import { secureNewFn } from '../util'
export const useWatchFieldDepend = (props, context, { updateModelValue, updateOtherValue, clearValues }) => {
  const securityConfig = computed(() => props.config ?? {})
  // 运行中的config
  const runningConfig = ref() // 运行时的config
  // 各类型自己的执行器
  // [FEAT]: 6.0.x changeConfig、changeValue支持流式处理
  // [REFACTOR]: 执行条件提升到执行器配置中
  const changeConfigExecutor = async (values, outValues, effects) => {
    // [PERF]: cloneDeep较为消耗性能如何优化
    let config = cloneDeep(securityConfig.value)
    for (let [changeConfigCb] of effects) {
      if (typeof changeConfigCb === 'string') {
        changeConfigCb = secureNewFn('config', 'values', 'outValues', changeConfigCb)
      }
      config = await changeConfigCb(config, values, outValues)
    }
    // 将不可修改的熟悉写入
    runningConfig.value = config
  }
  const changeValueExecutor = async (values, outValues, effects) => {
    let data
    for (const [changeValueCb] of effects) {
      data = await changeValueCb(values, outValues, data)
    }
    if (data) {
      const { value, otherValue } = data
      updateModelValue(value)
      updateOtherValue(otherValue)
    }
  }
  const resetValueExecutor = (values, outValues, effects) => {
    // 获取判断结果
    for (let [resetValueCb, { oldValues, keys }] of effects) {
      keys = [].concat(keys)
      oldValues = [].concat(oldValues)
      if (
        !(keys.length === 1 && keys[0] === props.fieldKey) && // 不能只有自己变了变了
        oldValues.some(val => val !== undefined) // 存在变更的依赖原始值不为undefined [1,undefined]  true [undefined,undefined] false
        // executeChangeValueEffect // 此条件提升至执行器配置中
      ) {
        if ((resetValueCb === true) ||
          (typeof resetValueCb === 'function' &&
            resetValueCb(getFieldValue(props.model, props.fieldKey), values, outValues)
          )
        ) {
          // 清空值只需要执行一次, 由于异步执行的关系，其执行顺序有可能在changeValue后导致他们同时运行时可能出现不一致的问题
          clearValues()
          return
        }
      }
    }
  }
  const changeValueByOldExecutor = async (values, outValues, effects) => {
    // 与changeValue一样，首次不触发
    let data
    for (let [changeValueByOldCb, { keys, oldValues }] of effects) {
      keys = [].concat(keys)
      oldValues = [].concat(oldValues)
      for (const [idx, key] of keys.entries()) {
        // 全局多源监听时会执行多次,不建议设置为全局副作用 [兼容老代码]
        data = await changeValueByOldCb({ key, oldValue: oldValues[idx] }, values, outValues, data)
      }
    }
    if (data !== undefined) {
      const { value, otherValue } = data
      updateModelValue(value)
      updateOtherValue(otherValue)
    }
  }

  const effectExecutorConfig = {
    // 允许effect为字符串，配置转换函数
    changeConfig: {
      executor: changeConfigExecutor,
      transformStrEffect: (effectStr) =>
        secureNewFn('config', 'dependOnValues', 'outDependOnValues', effectStr)
    },
    changeValue: {
      condition: (effects, executeChangeValueEffect) => !props.readonly && executeChangeValueEffect,
      executor: changeValueExecutor,
      transformStrEffect: (effectStr) =>
        secureNewFn('dependOnValues', 'outDependOnValues', 'data', effectStr)
    },
    resetValue: {
      condition: (effects, executeChangeValueEffect) => !props.readonly && executeChangeValueEffect,
      executor: resetValueExecutor
    }, // 此方法全局和局部只要执行一个就好了， 存在effect.resetValue不需要执行global.resetValue
    changeValueByOld: { // 此方法不存在global
      condition: (effects, executeChangeValueEffect) => !props.readonly && executeChangeValueEffect,
      executor: changeValueByOldExecutor
    }
  }
  const effectExecutor = new EffectExecutor(effectExecutorConfig)

  const dependOnWatchCb = ({ changeKeys, changeOldValues }, { values, outValues, executeChangeValueEffect }) => {
    // 获取局部effect的key
    const privateEffectKeys = changeKeys
      .map((key, index) => {
        if (typeof key === 'object') return { ...key, _index: index }
        return key
      }) // 塞入初始的index
      .filter(key => typeof key === 'object')
    // 获取全局effect的key
    const hasGlobalEffectKey = changeKeys.find(key => typeof key === 'string')
    const cbParams = []
    // 执行全局effect的回调
    if (hasGlobalEffectKey) {
      cbParams.push({}) // 只要有个无effect的标记即可，analysisEffects会使用globalParam中的配置
    }
    // 执行局部effect的回调
    privateEffectKeys.forEach(object => {
      const privateEffect = object.effect || {}
      cbParams.push({
        keys: object.key,
        oldValues: changeOldValues[object._index],
        effect: privateEffect
      })
    })
    // [BROKEN]: 6.0.x 除resetValue外，其他函数在执行私有的副作用时会优先执行全局的副作用
    effectExecutor.analysisEffects(cbParams, securityConfig.value, {
      values,
      outValues,
      keys: changeKeys,
      oldValues: changeOldValues,
      executeChangeValueEffect
    })
    effectExecutor.executeAll(props.fieldKey)
  }
  // 收集变化的依赖
  const { changeCount, dependOnValues, outDependOnValues } = useFieldChange(props, securityConfig, dependOnWatchCb)

  return {
    changeCount, // model变化总计
    dependOnValues,
    outDependOnValues,
    runningConfig
  }
}
