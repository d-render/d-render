// 执行器放到执行器内部
// 作用执行其
import { IAnyObject, IRenderConfig, IRenderConfigDependOn } from '@d-render/shared'
import { IKey } from './util'
type TEffectFn = ((...args: unknown[])=> unknown | Promise<unknown>) | boolean
interface IPrivateParam {
  keys: Array<string>
  oldValues: Array<unknown>
}
type TEffect = [
    TEffectFn,
    IPrivateParam
]

export type IEffects = Array<TEffect>
export type IExecutor = (values: IAnyObject, outValues: IAnyObject|undefined, effects: IEffects) => void | Promise<void>

interface IGlobalParam {
  values: IAnyObject
  outValues?: IAnyObject
  keys: Array<IKey>
  oldValues: Array<unknown>
  executeChangeValueEffect: boolean
}

interface IEffectExecutorConfig {
  executor: IExecutor
  condition?: (effects: IEffects, executeChangeValueEffect: boolean) => boolean
  // eslint-disable-next-line @typescript-eslint/ban-types
  transformStrEffect?: (effectStr: string) => Function
}
export interface IEffectExecutorConfigs{
 [propname: string]: IEffectExecutorConfig
}
interface IEffectConfig {
  [propname: string]: IEffects
}

interface IEffectParam {
  keys?: Array<string>
  effect?: IRenderConfigDependOn['effect'] // Record<string, Array<IFun>|IFun|boolean> | boolean
  oldValues?: Array<unknown>
}
// IEffectParam 全局模式时为空对象
type IEffectParams = Array<IEffectParam>

export class EffectExecutor {
  config: IEffectExecutorConfigs
  types: Array<string>
  executeChangeValueEffect?: boolean
  values?: IAnyObject
  outValues?: IAnyObject
  effectsConfig?: IEffectConfig
  constructor (config: IEffectExecutorConfigs = {}) {
    this.config = config
    this.types = Object.keys(this.config)
  }

  setExecutor (type: string, executor: IExecutor) {
    this.config[type] = {} as IEffectExecutorConfig
    this.config[type].executor = executor
    this.types = Object.keys(this.config)
  }

  // 处理数组及字符型数据
  compatibleEffect (effectConfig: IAnyObject, type: string, param: IPrivateParam|IGlobalParam) {
    const transformStrEffect = this.config[type].transformStrEffect
    const effect = transformStrEffect
      ? effectConfig[type] || effectConfig[`${type}Str`]
      : effectConfig[type]
    return ([] as Array<string|TEffectFn>).concat(effect as TEffectFn).map(e => {
      let fn: TEffectFn = e as TEffectFn
      // 当transformStrEffect不存在时 string无法转换为函数
      if (typeof e === 'string') {
        if (typeof transformStrEffect === 'function') {
          fn = transformStrEffect(e) as TEffectFn
        } else {
          fn = () => {
            console.warn(`[transformStrEffect warn]: ${type}未配置字符串转函数的方法`)
          }
        }
      }
      return [fn, param]
    })
  }

  getGlobalEffect (fieldConfig: IRenderConfig, type: string) {
    return this.config[type].transformStrEffect
      ? (fieldConfig[type] || fieldConfig[`${type}Str`])
      : fieldConfig[type]
  }

  getExecuteEffect (params: IEffectParams, fieldConfig: IRenderConfig, globalParam: IGlobalParam) {
    console.log('params', params)
    const analysisEffects = this.types
    // 初始化
    const executeObject = analysisEffects.reduce((acc: { [key: string]: Array<unknown> }, key) => {
      acc[key] = []
      return acc
    }, {})
    const globalEffectSign = analysisEffects.reduce((acc:{ [key: string]: boolean }, key) => {
      acc[key] = false
      return acc
    }, {})
    // 获取到
    const globalParams = params.filter(param => {
      return param.effect === undefined || param.effect === true
    })

    if (globalParams.length > 0) {
      // 存在时从global中需要执行的effect
      analysisEffects.forEach(key => {
        if (this.getGlobalEffect(fieldConfig, key)) globalEffectSign[key] = true
      })
      params = params.filter(param => {
        return !(param.effect === undefined || param.effect === true)
      })
    }
    // 此时的params均为局部处理 分析effect
    (params as Array<Required<Omit<IEffectParam, 'effect'> & {effect: Exclude<IEffectParam['effect'], boolean | undefined>}>>).forEach(param => {
      const { effect, ...privateParam } = param // 入参数抛弃effect
      analysisEffects.forEach(key => {
        // resetValue 具有一定的特殊性, 其存在局部时，不需要触发global的 但是允许存在global的reset
        if (typeof effect[key] === 'function') {
          if (key !== 'resetValue') globalEffectSign[key] = true
          executeObject[key].push(...this.compatibleEffect(effect, key, privateParam))
        } else if (effect[key] === true) {
          if (key !== 'resetValue') {
            globalEffectSign[key] = true
          } else {
            executeObject[key].push(...this.compatibleEffect(effect, key, privateParam))
          }
        }
      })
    })

    // 此处的入参数需要再商讨
    analysisEffects.forEach(key => {
      if (globalEffectSign[key] && this.getGlobalEffect(fieldConfig, key)) {
        executeObject[key].unshift(...this.compatibleEffect(fieldConfig, key, globalParam))
      } else {
        // if (!globalEffectSign[key]) console.log(`不需要${key}全局effect`)
        // if (!config[key]) console.log(`没有${key}全局effect`)
      }
    })
    console.log('executeObject', executeObject)
    return executeObject as IEffectConfig
  }

  analysisEffects (effectParams: IEffectParams, config: IRenderConfig, globalParam: IGlobalParam) {
    console.log('effectParams', effectParams)
    this.executeChangeValueEffect = globalParam.executeChangeValueEffect
    this.values = globalParam.values
    this.outValues = globalParam.outValues
    this.effectsConfig = this.getExecuteEffect(effectParams, config, globalParam)
  }

  execute (type: string, logKey: string, ...args: [effects: IEffects, executeChangeValueEffect: boolean]) {
    const condition = this.config[type].condition
    if (args[0].length > 0) {
      if (!condition || (condition && condition(...args))) {
        this.config[type].executor(this.values!, this.outValues, args[0])
        console.log(`%c[d-render]%c执行%c${logKey}.${type}`, 'color: #e6a23c', 'color: normal', 'color: #67c23a')
      } else {
        console.log(`%c[d-render]%c不符合%c${logKey}.${type}%c执行条件`, 'color: #e6a23c', 'color: normal', 'color: red', 'color: normal', args[0])
      }
    }
  }

  executeAll (logKey: string) {
    // 是否让xx按顺序执行
    Object.keys(this.effectsConfig as IEffectConfig).forEach((type) => {
      this.execute(type, logKey, this.effectsConfig![type], this.executeChangeValueEffect!)
    })
  }
}
