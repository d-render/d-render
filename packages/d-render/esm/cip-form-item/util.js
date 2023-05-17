import { unref } from 'vue';
import { DRender, setFieldValue, getFieldValue, isNotEmpty } from '@d-render/shared';

const getValuesByKeys = (data = {}, keys = []) => {
  const result = {};
  keys.forEach((key) => {
    if (typeof key === "object") {
      const object = key;
      setFieldValue(result, object.key, getFieldValue(data, object.key));
    } else {
      setFieldValue(result, key, getFieldValue(data, key));
    }
  });
  return result;
};
const setValuesByKeys = (target = {}, keys = [], values = {}) => {
  keys.forEach((key) => {
    if (typeof key === "object") {
      const object = key;
      setFieldValue(target, object.key, getFieldValue(values, object.key));
    } else {
      setFieldValue(target, key, getFieldValue(values, key));
    }
  });
};
const isHideLabel = (config) => {
  return config.hideLabel || isNotEmpty(config.labelWidth) && !config.labelWidth || !config.label;
};
const getLabelWidth = (config) => {
  if (config.hideLabel)
    return "0px";
  if (isNotEmpty(config.labelWidth)) {
    if (isNaN(config.labelWidth))
      return config.labelWidth;
    return config.labelWidth + "px";
  }
  if (!config.label)
    return "0px";
  return void 0;
};
const getChangeIndex = (values, oldValues) => {
  const result = [];
  values.forEach((v, i) => {
    if (typeof v === "object") {
      result.push(i);
    } else {
      if (v !== oldValues[i]) {
        result.push(i);
      }
    }
  });
  return result;
};
const secureNewFn = (...params) => {
  const funcBody = params.pop();
  try {
    return new Function(...params, funcBody);
  } catch (error) {
    console.error(error);
    return () => {
    };
  }
};
const judgeUseFn = (key, config, effect) => {
  if (key === "changeValue" && config.changeValueStr) {
    return secureNewFn(
      "dependOnValues",
      "outDependOnValues",
      config.changeValueStr
    );
  }
  if (key === "changeConfig" && config.changeConfigStr) {
    return secureNewFn(
      "config",
      "dependOnValues",
      "outDependOnValues",
      config.changeConfigStr
    );
  }
  if (key === "asyncOptions" && typeof config.asyncOptions === "string") {
    return secureNewFn("dependOnValues", "outDependOnValues", config.asyncOptions);
  }
  if (!effect)
    return config[key];
  if (effect && key in effect) {
    if (typeof effect[key] === "function")
      return effect[key];
    return config[key];
  }
};
class UpdateModelQueue {
  constructor(getModel, updateModel) {
    this.getModel = getModel;
    this.updateModel = updateModel;
  }
  init() {
    this.data = /* @__PURE__ */ new Map();
  }
  append(key, value) {
    if (!this.isCollect) {
      this.init();
      this.isCollect = true;
    }
    this.data.set(key, value);
    this.update();
  }
  update() {
    const model = unref(this.getModel());
    for (const key of this.data.keys()) {
      const value = this.data.get(key);
      setFieldValue(model, key, value);
    }
    this.isCollect = false;
    this.updateModel(model);
  }
}
const dRender = new DRender();
const getInputComponent = (type) => {
  return dRender.getComponent(type);
};
const getViewComponent = (type) => {
  return dRender.getComponent(type, "view");
};
const getH5InputComponent = (type) => {
  return dRender.getComponent(type, "mobile");
};

export { UpdateModelQueue, getChangeIndex, getH5InputComponent, getInputComponent, getLabelWidth, getValuesByKeys, getViewComponent, isHideLabel, judgeUseFn, secureNewFn, setValuesByKeys };
