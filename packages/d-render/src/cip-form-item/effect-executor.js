// 执行器放到执行器内部
// 作用执行其
export class EffectExecutor {
  constructor (config = {}) {
    this.config = config
    this.types = Object.keys(this.config)
  }

  setExecutor (type, executor) {
    this.config[type] = {}
    this.config[type].executor = executor
    this.types = Object.keys(this.config)
  }

  // 处理数组及字符型数据
  compatibleEffect (effectConfig, type, param) {
    const transformStrEffect = this.config[type].transformStrEffect
    const effect = transformStrEffect
      ? effectConfig[type] || effectConfig[`${type}Str`]
      : effectConfig[type]
    return [].concat(effect).map(e => {
      if (typeof e === 'string' && transformStrEffect) {
        console.log(e)
        e = this.config[type].transformStrEffect(e)
      }
      return [e, param]
    })
  }

  getGlobalEffect (fieldConfig, type) {
    return this.config[type].transformStrEffect
      ? (fieldConfig[type] || fieldConfig[`${type}Str`])
      : fieldConfig[type]
  }

  getExecuteEffect (params, fieldConfig, globalParam) {
    const analysisEffects = this.types
    // 初始化
    const executeObject = analysisEffects.reduce((acc, key) => {
      acc[key] = []
      return acc
    }, {})
    const globalEffectSign = analysisEffects.reduce((acc, key) => {
      acc[key] = false
      return acc
    }, {})
    // 获取到
    const globalParams = params.filter(param => [undefined, true].includes(param.effect))

    if (globalParams.length > 0) {
      // 存在时从global中需要执行的effect
      analysisEffects.forEach(key => {
        if (this.getGlobalEffect(fieldConfig, key)) globalEffectSign[key] = true
      })
      params = params.filter(param => ![undefined, true].includes(param.effect))
    }
    // 此时的params均为局部处理 分析effect
    params.forEach(param => {
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
    return executeObject
  }

  analysisEffects (effectParams, config, globalParam) {
    this.executeChangeValueEffect = globalParam.executeChangeValueEffect
    this.values = globalParam.values
    this.outValues = globalParam.outValues
    this.effectsConfig = this.getExecuteEffect(effectParams, config, globalParam)
  }

  execute (type, logKey, ...args) {
    const condition = this.config[type].condition
    if (args[0].length > 0) {
      if (!condition || (condition && condition(...args))) {
        this.config[type].executor(this.values, this.outValues, ...args)
        console.log(`%c[d-render]%c执行%c${logKey}.${type}`, 'color: #e6a23c', 'color: normal', 'color: #67c23a')
      } else {
        console.log(`%c[d-render]%c不符合%c${logKey}.${type}%c执行条件`, 'color: #e6a23c', 'color: normal', 'color: red', 'color: normal', args[0])
      }
    }
  }

  executeAll (logKey) {
    // 是否让xx按顺序执行
    Object.keys(this.effectsConfig).forEach((type) => {
      this.execute(type, logKey, this.effectsConfig[type], this.executeChangeValueEffect)
    })
  }
}
