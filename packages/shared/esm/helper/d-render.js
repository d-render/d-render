import { defineAsyncComponent } from 'vue';

var __defProp = Object.defineProperty;
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
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const defaultInputComponentConfig = {}, defaultLayoutComponentConfig = {};
const generateAppendKey = (append) => {
  return append ? `-${append}` : "";
};
const analyseComponents = (dictionary, append) => {
  const result = {};
  const appendKey = generateAppendKey(append);
  const appendPath = append ? `/${append}` : "";
  Object.keys(dictionary).map((key) => {
    const loader = dictionary[key](appendPath) || dictionary.default(appendPath);
    result[`${key}${appendKey}`] = defineAsyncComponent({
      loader,
      errorComponent: defineAsyncComponent(dictionary.default(appendPath)),
      onError(error, retry, fail, attempts) {
        console.log(error);
        console.warn(`${key}${appendKey}\u7EC4\u4EF6\u52A0\u8F7D\u5931\u8D25\uFF0C\u52A0\u8F7D\u9ED8\u8BA4\u7EC4\u4EF6`);
        fail();
      }
    });
  });
  return result;
};
const getComponentDictionary = (componentConfig) => {
  const result = {};
  Object.keys(componentConfig).forEach((key) => {
    const config = componentConfig[key];
    const component = typeof config === "function" ? config : componentConfig[key].component;
    result[key] = component;
  });
  return result;
};
const getLayoutType = (componentConfig) => {
  const result = [];
  Object.keys(componentConfig).forEach((key) => {
    if (componentConfig[key].layout) {
      result.push(key);
    }
  });
  return result;
};
const getPageType = (componentConfig) => {
  const result = [];
  Object.keys(componentConfig).forEach((key) => {
    if (componentConfig[key].page) {
      result.push(key);
    }
  });
  return result;
};
class DRender {
  constructor() {
    __publicField(this, "defaultComponentConfig", {});
    __publicField(this, "componentDictionary", {});
    __publicField(this, "layoutTypeList", []);
    if (!DRender.instance) {
      this.init();
      DRender.instance = this;
    }
    return DRender.instance;
  }
  // 初始化
  init() {
    const defaultComponentConfig = __spreadValues(__spreadValues({}, defaultInputComponentConfig), defaultLayoutComponentConfig);
    this.defaultComponentConfig = defaultComponentConfig;
    this.componentDictionary = getComponentDictionary(defaultComponentConfig);
    this.layoutTypeList = getLayoutType(defaultComponentConfig);
  }
  setConfig(renderConfig = {}) {
    const { components, plugins } = renderConfig;
    const customComponentConfig = {};
    if (components)
      Object.assign(customComponentConfig, components);
    if (plugins)
      Object.assign(customComponentConfig, ...plugins);
    this.setCustomComponents(customComponentConfig);
  }
  setCustomComponents(customComponentsConfig) {
    const componentConfig = __spreadValues(__spreadValues({}, this.defaultComponentConfig), customComponentsConfig);
    const componentDictionary = getComponentDictionary(componentConfig);
    this.componentDictionary = componentDictionary;
    this.layoutTypeList = getLayoutType(componentConfig);
    this.pageTypeList = getPageType(componentConfig);
  }
  // 获取组件
  getComponent(type, append = "") {
    if (!this[`${append}Components`]) {
      this[`${append}Components`] = analyseComponents(this.componentDictionary, append);
    }
    const components = this[`${append}Components`][`${type}${generateAppendKey(append)}`];
    if (components)
      return components;
    return this[`${append}Components`][`default${generateAppendKey(append)}`];
  }
  isLayoutType(type) {
    return this.layoutTypeList.includes(type);
  }
  isPageType(type) {
    return this.pageTypeList.includes(type);
  }
}
const defineDRenderConfig = (val) => val;

export { DRender, defineDRenderConfig };
