import { cloneDeep, isArray, getFieldValue } from './util';

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
const generateFieldList = (...args) => configMapToList(mergeFieldConfig(...args));
const mergeFieldConfig = (targetConfigMap, ...sourceConfigMaps) => {
  const result = {};
  Object.keys(targetConfigMap).forEach((key) => {
    const targetConfig = targetConfigMap[key] || {};
    result[key] = getMergeConfig(key, targetConfig, sourceConfigMaps);
  });
  return result;
};
const configMapToList = (configMap) => {
  return Object.keys(configMap).map((key, i) => {
    const config = configMap[key];
    key = config.realKey || key;
    return {
      key,
      // realKey的优先级高于key,
      config,
      sort: config.configSort || i
    };
  }).sort((a, b) => a.sort - b.sort);
};
const insertFieldConfigToList = (target = [], source) => {
  target = [...target];
  source.forEach((fieldConfig) => {
    const { config: { insert } = {} } = fieldConfig;
    if (insert) {
      const offset = insert.before ? 0 : 1;
      const anchorKey = insert.before || insert.after;
      const anchorIndex = target.findIndex((tFieldConfig) => tFieldConfig.key === anchorKey);
      target.splice(anchorIndex + offset, 0, fieldConfig);
    } else {
      target.push(fieldConfig);
    }
  });
  return target;
};
const configListToMap = (configList) => {
  const result = {};
  configList.forEach(({ key, config } = {}) => {
    if (key) {
      result[key] = config;
    }
  });
  return result;
};
const handlerDependOn = (dependOn, newDependOn, isMerge) => {
  if (dependOn && newDependOn) {
    const result = isMerge ? [...dependOn, ...newDependOn] : newDependOn;
    return result.length > 0 ? result : void 0;
  } else {
    return dependOn || newDependOn;
  }
};
function getMergeConfig(key, targetConfig, sourceConfigMaps) {
  let sourceConfig = {};
  const sourceKey = targetConfig.sourceKey || targetConfig.realKey || key;
  let dependOn = [];
  const isMergeDependOn = targetConfig.mergeDependOn === true;
  if (sourceKey) {
    const sourceKeys = sourceKey.split(".");
    sourceConfigMaps.forEach((sourceConfigMap = {}) => {
      let sourceConfigNext = getFieldConfig(sourceConfigMap[sourceKey]);
      if (!sourceConfigNext && sourceKeys.length > 1) {
        sourceConfigNext = getFieldConfig(sourceConfigMap[sourceKeys[0]]);
        const preKey = [sourceKeys[0]];
        for (let i = 1; i < sourceKeys.length; i++) {
          if (!sourceConfigNext)
            break;
          sourceConfigNext = getFieldConfig(sourceConfigNext[sourceKeys[i]], preKey.join("."));
          preKey.push(sourceKeys[i]);
        }
      }
      dependOn = handlerDependOn(sourceConfig == null ? void 0 : sourceConfig.dependOn, sourceConfigNext == null ? void 0 : sourceConfigNext.dependOn, isMergeDependOn);
      sourceConfig = __spreadValues(__spreadValues({}, sourceConfig), sourceConfigNext);
    });
  }
  if (isMergeDependOn) {
    dependOn = handlerDependOn(dependOn, targetConfig.dependOn, true);
  } else {
    dependOn = targetConfig.dependOn || dependOn;
  }
  return __spreadProps(__spreadValues(__spreadValues({}, sourceConfig), targetConfig), { dependOn });
}
const handlerEffectFunction = (fn, key, preKey) => {
  if (typeof fn !== "function")
    return fn;
  if (key === "changeConfig") {
    return (...args) => {
      var _a, _b;
      return fn(args[0], (_a = getFieldValue(args[1], preKey)) != null ? _a : {}, (_b = getFieldValue(args[2], preKey)) != null ? _b : {});
    };
  }
  if (["changeValue", "asyncOptions", "getOptionsFilter"].includes(key)) {
    return (...args) => {
      var _a, _b;
      return fn((_a = getFieldValue(args[0], preKey)) != null ? _a : {}, (_b = getFieldValue(args[1], preKey)) != null ? _b : {});
    };
  }
  return fn;
};
function getFieldConfig(config, preKey = "") {
  if (config == null ? void 0 : config._renderConfig) {
    const _renderConfig = cloneDeep(config._renderConfig);
    if (preKey) {
      const dependOn = _renderConfig.dependOn;
      if ((dependOn == null ? void 0 : dependOn.length) > 0) {
        _renderConfig.dependOn = dependOn.map((on) => {
          if (typeof on === "object") {
            const effect = handlerEffect(on.effect, preKey);
            return {
              key: `${preKey}.${on.key}`,
              effect
            };
          } else {
            return `${preKey}.${on}`;
          }
        });
        ["changeConfig", "changeValue", "asyncOptions", "getOptionsFilter"].forEach((key) => {
          if (typeof _renderConfig[key] === "function") {
            _renderConfig[key] = handlerEffectFunction(_renderConfig[key], key, preKey);
          }
        });
      }
      const otherKey = _renderConfig.otherKey;
      if (typeof otherKey === "string") {
        _renderConfig.otherKey = `${preKey}.${otherKey}`;
      } else if (isArray(otherKey)) {
        _renderConfig.otherKey = otherKey.map((v) => `${preKey}.${v}`);
      }
    }
    return _renderConfig;
  } else {
    return config;
  }
}
function handlerEffect(effect, preKey) {
  const result = {};
  Object.keys(effect).forEach((key) => {
    const item = effect[key];
    if (typeof item !== "function") {
      result[key] = item;
    } else {
      result[key] = handlerEffectFunction(item, key, preKey);
    }
  });
  return result;
}
const keysToConfigMap = (keys) => {
  const configMap = {};
  keys.forEach((key) => {
    let config = {};
    if (typeof key === "object") {
      config = __spreadValues({}, key);
      key = key.key;
      config.key = void 0;
    }
    configMap[key] = config;
  });
  return configMap;
};
const defineFieldConfig = (config) => config;
const defineFormFieldConfig = (config) => config;
const defineTableFieldConfig = (config) => config;
const defineSearchFieldConfig = (config) => config;

export { configListToMap, configMapToList, defineFieldConfig, defineFormFieldConfig, defineSearchFieldConfig, defineTableFieldConfig, generateFieldList, insertFieldConfigToList, keysToConfigMap, mergeFieldConfig };
