var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
class EffectExecutor {
  constructor(config = {}) {
    this.config = config;
    this.types = Object.keys(this.config);
  }
  setExecutor(type, executor) {
    this.config[type] = {};
    this.config[type].executor = executor;
    this.types = Object.keys(this.config);
  }
  // 处理数组及字符型数据
  compatibleEffect(effectConfig, type, param) {
    const transformStrEffect = this.config[type].transformStrEffect;
    const effect = transformStrEffect ? effectConfig[type] || effectConfig[`${type}Str`] : effectConfig[type];
    return [].concat(effect).map((e) => {
      if (typeof e === "string" && transformStrEffect) {
        console.log(e);
        e = this.config[type].transformStrEffect(e);
      }
      return [e, param];
    });
  }
  getGlobalEffect(fieldConfig, type) {
    return this.config[type].transformStrEffect ? fieldConfig[type] || fieldConfig[`${type}Str`] : fieldConfig[type];
  }
  getExecuteEffect(params, fieldConfig, globalParam) {
    const analysisEffects = this.types;
    const executeObject = analysisEffects.reduce((acc, key) => {
      acc[key] = [];
      return acc;
    }, {});
    const globalEffectSign = analysisEffects.reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    const globalParams = params.filter((param) => [void 0, true].includes(param.effect));
    if (globalParams.length > 0) {
      analysisEffects.forEach((key) => {
        if (this.getGlobalEffect(fieldConfig, key))
          globalEffectSign[key] = true;
      });
      params = params.filter((param) => ![void 0, true].includes(param.effect));
    }
    params.forEach((param) => {
      const _a = param, { effect } = _a, privateParam = __objRest(_a, ["effect"]);
      analysisEffects.forEach((key) => {
        if (typeof effect[key] === "function") {
          if (key !== "resetValue")
            globalEffectSign[key] = true;
          executeObject[key].push(...this.compatibleEffect(effect, key, privateParam));
        } else if (effect[key] === true) {
          if (key !== "resetValue") {
            globalEffectSign[key] = true;
          } else {
            executeObject[key].push(...this.compatibleEffect(effect, key, privateParam));
          }
        }
      });
    });
    analysisEffects.forEach((key) => {
      if (globalEffectSign[key] && this.getGlobalEffect(fieldConfig, key)) {
        executeObject[key].unshift(...this.compatibleEffect(fieldConfig, key, globalParam));
      }
    });
    console.log("executeObject", executeObject);
    return executeObject;
  }
  analysisEffects(effectParams, config, globalParam) {
    this.executeChangeValueEffect = globalParam.executeChangeValueEffect;
    this.values = globalParam.values;
    this.outValues = globalParam.outValues;
    this.effectsConfig = this.getExecuteEffect(effectParams, config, globalParam);
  }
  execute(type, ...args) {
    const condition = this.config[type].condition;
    if (!condition || condition && condition(...args)) {
      this.config[type].executor(this.values, this.outValues, ...args);
    } else {
      console.log(`\u4E0D\u7B26\u5408${type}\u6267\u884C\u6761\u4EF6`);
    }
  }
  executeAll() {
    Object.keys(this.effectsConfig).forEach((type) => {
      this.execute(type, this.effectsConfig[type], this.executeChangeValueEffect);
    });
  }
}

export { EffectExecutor };
