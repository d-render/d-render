import { computed, ref } from 'vue';
import { getFieldValue, cloneDeep } from '@d-render/shared';
import { EffectExecutor } from '../effect-executor';
import { useFieldChange } from './use-field-change';
import { secureNewFn } from '../util';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const useWatchFieldDepend = (props, context, { updateModelValue, updateOtherValue, clearValues }) => {
  const securityConfig = computed(() => {
    var _a;
    return (_a = props.config) != null ? _a : {};
  });
  const runningConfig = ref();
  const changeConfigExecutor = (values, outValues, effects) => __async(void 0, null, function* () {
    let config = cloneDeep(securityConfig.value);
    for (let [changeConfigCb] of effects) {
      if (typeof changeConfigCb === "string") {
        changeConfigCb = secureNewFn("config", "values", "outValues", changeConfigCb);
      }
      config = yield changeConfigCb(config, values, outValues);
    }
    runningConfig.value = config;
  });
  const changeValueExecutor = (values, outValues, effects) => __async(void 0, null, function* () {
    let data;
    for (const [changeValueCb] of effects) {
      data = yield changeValueCb(values, outValues, data);
    }
    if (data) {
      const { value, otherValue } = data;
      updateModelValue(value);
      updateOtherValue(otherValue);
    }
  });
  const resetValueExecutor = (values, outValues, effects) => {
    for (let [resetValueCb, { oldValues, keys }] of effects) {
      keys = [].concat(keys);
      oldValues = [].concat(oldValues);
      if (!(keys.length === 1 && keys[0] === props.fieldKey) && // 不能只有自己变了变了
      oldValues.some((val) => val !== void 0)) {
        if (resetValueCb === true || typeof resetValueCb === "function" && resetValueCb(getFieldValue(props.model, props.fieldKey), values, outValues)) {
          clearValues();
          return;
        }
      }
    }
  };
  const changeValueByOldExecutor = (values, outValues, effects) => __async(void 0, null, function* () {
    let data;
    for (let [changeValueByOldCb, { keys, oldValues }] of effects) {
      keys = [].concat(keys);
      oldValues = [].concat(oldValues);
      for (const [idx, key] of keys.entries()) {
        data = yield changeValueByOldCb({ key, oldValue: oldValues[idx] }, values, outValues, data);
      }
    }
    if (data !== void 0) {
      const { value, otherValue } = data;
      updateModelValue(value);
      updateOtherValue(otherValue);
    }
  });
  const effectExecutorConfig = {
    // 允许effect为字符串，配置转换函数
    changeConfig: {
      executor: changeConfigExecutor,
      transformStrEffect: (effectStr) => secureNewFn("config", "dependOnValues", "outDependOnValues", effectStr)
    },
    changeValue: {
      condition: (effects, executeChangeValueEffect) => !props.readonly && executeChangeValueEffect,
      executor: changeValueExecutor,
      transformStrEffect: (effectStr) => secureNewFn("dependOnValues", "outDependOnValues", "data", effectStr)
    },
    resetValue: {
      condition: (effects, executeChangeValueEffect) => !props.readonly && executeChangeValueEffect,
      executor: resetValueExecutor
    },
    // 此方法全局和局部只要执行一个就好了， 存在effect.resetValue不需要执行global.resetValue
    changeValueByOld: {
      // 此方法不存在global
      condition: (effects, executeChangeValueEffect) => !props.readonly && executeChangeValueEffect,
      executor: changeValueByOldExecutor
    }
  };
  const effectExecutor = new EffectExecutor(effectExecutorConfig);
  const dependOnWatchCb = ({ changeKeys, changeOldValues }, { values, outValues, executeChangeValueEffect }) => {
    const privateEffectKeys = changeKeys.map((key, index) => {
      if (typeof key === "object")
        return __spreadProps(__spreadValues({}, key), { _index: index });
      return key;
    }).filter((key) => typeof key === "object");
    const hasGlobalEffectKey = changeKeys.find((key) => typeof key === "string");
    const cbParams = [];
    if (hasGlobalEffectKey) {
      cbParams.push({});
    }
    privateEffectKeys.forEach((object) => {
      const privateEffect = object.effect || {};
      cbParams.push({
        keys: object.key,
        oldValues: changeOldValues[object._index],
        effect: privateEffect
      });
    });
    effectExecutor.analysisEffects(cbParams, securityConfig.value, {
      values,
      outValues,
      keys: changeKeys,
      oldValues: changeOldValues,
      executeChangeValueEffect
    });
    effectExecutor.executeAll();
  };
  const { changeCount, dependOnValues, outDependOnValues } = useFieldChange(props, securityConfig, dependOnWatchCb);
  return {
    changeCount,
    // model变化总计
    dependOnValues,
    outDependOnValues,
    runningConfig
  };
};

export { useWatchFieldDepend };
