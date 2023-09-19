import { computed, ComputedRef, ShallowRef, shallowRef } from 'vue'
// cloneDeep,
import { getFieldValue, IAnyObject, IRenderConfig } from '@d-render/shared'
import { EffectExecutor, IEffectExecutorConfigs, IExecutor, IEffects } from '../effect-executor'
import { useFieldChange } from './use-field-change'
import { secureNewFn, cloneDeepConfig, IKey, IObjectKey } from '../util'
import type { FormItemProps } from '../index'

export const useWatchFieldDepend = (
  props: FormItemProps,
  { updateModelValue, updateOtherValue, clearValues }: {
    updateModelValue: (val:unknown) => Promise<void>
    updateOtherValue: (val:unknown) => Promise<void>
    clearValues: () => void
  }
) => {
  const securityConfig: ComputedRef<IRenderConfig> = computed(() => props.config ?? {})
  // 运行中的config
  // [PERF]: 6.1.x 使用shallowRef优化对config的相应
  const runningConfig: ShallowRef<IRenderConfig|undefined> = shallowRef() // 运行时的config
  // 各类型自己的执行器
  // [PERF]: 6.1.x初步优化cloneDeep的性能不在对一些特殊的属性进行深度复制
  // [FEAT]: 6.0.x changeConfig、changeValue支持流式处理
  // [REFACTOR]: 执行条件提升到执行器配置中
  const changeConfigExecutor = async (
    values: Parameters<IExecutor>['0'],
    outValues: Parameters<IExecutor>['1'],
    effects: Parameters<IExecutor>['2']
  ) => {
    // [PERF]: cloneDeep较为消耗性能如何优化
    let config = cloneDeepConfig(securityConfig.value)
    for (let [changeConfigCb] of effects) {
      if (typeof changeConfigCb === 'string') {
        changeConfigCb = secureNewFn('config', 'values', 'outValues', changeConfigCb) as ()=> Promise<IRenderConfig>
      }
      if (typeof changeConfigCb === 'boolean') {
        continue
      }
      config = await changeConfigCb(config, values, outValues) as IRenderConfig
    }
    runningConfig.value = config
  }
  const changeValueExecutor = async (
    values: Parameters<IExecutor>['0'],
    outValues: Parameters<IExecutor>['1'],
    effects: Parameters<IExecutor>['2']
  ) => {
    let data
    for (let [changeValueCb] of effects) {
      if (typeof changeValueCb === 'string') {
        changeValueCb = secureNewFn('values', 'outValues', changeValueCb) as ()=> Promise<{ value: unknown, otherValue?: unknown } | undefined>
      }
      if (typeof changeValueCb === 'boolean') {
        continue
      }
      data = await changeValueCb(values, outValues, data) as ()=> Promise<{ value: unknown, otherValue?: unknown }>
    }
    if (typeof data === 'object') {
      const { value, otherValue } = data
      updateModelValue(value)
      updateOtherValue(otherValue)
    }
  }
  const resetValueExecutor = (
    values: Parameters<IExecutor>['0'],
    outValues: Parameters<IExecutor>['1'],
    effects: Parameters<IExecutor>['2']
  ) => {
    // 获取判断结果
    for (let [resetValueCb, { oldValues, keys }] of effects) {
      keys = ([] as Array<string>).concat(keys)
      oldValues = ([]as Array<unknown>).concat(oldValues)
      if (
        !(keys.length === 1 && keys[0] === props.fieldKey) && // 不能只有自己变了变了
        oldValues.some(val => val !== undefined) // 存在变更的依赖原始值不为undefined [1,undefined]  true [undefined,undefined] false
        // executeChangeValueEffect // 此条件提升至执行器配置中
      ) {
        if ((resetValueCb === true) ||
          (typeof resetValueCb === 'function' &&
            resetValueCb(getFieldValue(props.model, props.fieldKey!), values, outValues)
          )
        ) {
          // 清空值只需要执行一次, 由于异步执行的关系，其执行顺序有可能在changeValue后导致他们同时运行时可能出现不一致的问题
          clearValues()
          return
        }
      }
    }
  }
  const changeValueByOldExecutor = async (
    values: Parameters<IExecutor>['0'],
    outValues: Parameters<IExecutor>['1'],
    effects: Parameters<IExecutor>['2']
  ) => {
    // 与changeValue一样，首次不触发
    let data
    for (let [changeValueByOldCb, { keys, oldValues }] of effects) {
      keys = ([] as Array<string>).concat(keys)
      oldValues = ([]as Array<unknown>).concat(oldValues)
      if (typeof changeValueByOldCb === 'boolean') {
        continue
      }
      for (const [idx, key] of keys.entries()) {
        // 全局多源监听时会执行多次,不建议设置为全局副作用 [兼容老代码]
        data = await changeValueByOldCb({ key, oldValue: oldValues[idx] }, values, outValues, data) as {value: unknown, otherValue: unknown} | undefined
      }
    }
    if (data !== undefined) {
      const { value, otherValue } = data
      updateModelValue(value)
      updateOtherValue(otherValue)
    }
  }

  const effectExecutorConfig: IEffectExecutorConfigs = {
    // 允许effect为字符串，配置转换函数
    changeConfig: {
      executor: changeConfigExecutor,
      transformStrEffect: (effectStr: string) =>
        secureNewFn('config', 'dependOnValues', 'outDependOnValues', effectStr)
    },
    changeValue: {
      condition: (effects: IEffects, executeChangeValueEffect: boolean) => !props.readonly && executeChangeValueEffect,
      executor: changeValueExecutor,
      transformStrEffect: (effectStr: string) =>
        secureNewFn('dependOnValues', 'outDependOnValues', 'data', effectStr)
    },
    resetValue: {
      condition: (effects: IEffects, executeChangeValueEffect: boolean) => !props.readonly && executeChangeValueEffect,
      executor: resetValueExecutor
    }, // 此方法全局和局部只要执行一个就好了， 存在effect.resetValue不需要执行global.resetValue
    changeValueByOld: { // 此方法不存在global
      condition: (effects: IEffects, executeChangeValueEffect: boolean) => !props.readonly && executeChangeValueEffect,
      executor: changeValueByOldExecutor
    }
  }
  const effectExecutor = new EffectExecutor(effectExecutorConfig)

  const dependOnWatchCb = (
    { changeKeys, changeOldValues }: {changeKeys: Array<IKey>, changeOldValues: Array<unknown> },
    { values, outValues, executeChangeValueEffect }: {values: IAnyObject, outValues: IAnyObject, executeChangeValueEffect: boolean}
  ) => {
    // 获取局部effect的key
    const privateEffectKeys = changeKeys
      .map((key, index) => {
        if (typeof key === 'object') return { ...key, _index: index }
        return key
      }) // 塞入初始的index
      .filter(key => typeof key === 'object') as Array<IObjectKey & {_index: number }>
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
    effectExecutor.executeAll(props.fieldKey as string)
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
