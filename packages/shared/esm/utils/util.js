import lodashCloneDeep from 'lodash-es/cloneDeep';

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
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
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const cloneDeep = (value) => {
  return lodashCloneDeep(value);
};
const objectEqual = (objectA = {}, objectB = {}) => {
  if (objectA === objectB)
    return true;
  const keysA = Object.keys(objectA);
  const keysB = Object.keys(objectB);
  if (keysA.length !== keysB.length)
    return false;
  const keysLength = keysA.length;
  for (let i = 0; i < keysLength; i++) {
    const keyA = keysA[i];
    if (!keysB.includes(keyA))
      return false;
    const valueA = objectA[keyA];
    const valueB = objectB[keyA];
    if (typeof valueA === "object" && typeof valueB === "object") {
      if (!objectEqual(valueA, valueB))
        return false;
    } else {
      if (valueA !== valueB)
        return false;
    }
  }
  return true;
};
function throttle(fn, delay) {
  let pre = 0;
  return function() {
    const args = arguments;
    const now = Date.now();
    if (now - pre > delay) {
      pre = now;
      fn.apply(this, args);
    }
  };
}
const debounce = (fn, wait, immediate) => {
  let timeout, result;
  const debounced = function() {
    const context = this;
    const args = arguments;
    if (timeout)
      clearTimeout(timeout);
    if (immediate) {
      const callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow)
        result = fn.apply(context, args);
    } else {
      timeout = setTimeout(() => {
        fn.apply(context, args);
      }, wait);
    }
    return result;
  };
  debounced.cancel = () => {
    clearTimeout(timeout);
    timeout = null;
  };
  return debounced;
};
const toUpperFirstCase = (str) => {
  const first = str.charAt(0);
  const upperFirst = first.toUpperCase();
  return upperFirst + str.slice(1);
};
const toTreeData = (list, parentKey = "parentId", root = 0) => {
  const cloneData = cloneDeep(list);
  const tree = cloneData.filter((father) => {
    const branchArr = cloneData.filter((child) => {
      return father.id === child[parentKey];
    });
    if (branchArr.length > 0) {
      father.children = branchArr;
    }
    return father[parentKey] === root;
  });
  tree.forEach((row) => {
    row[parentKey] = "";
  });
  return tree;
};
const isEmpty = (value) => {
  return value === void 0 || value === null;
};
const isInputEmpty = (value) => {
  return value === void 0 || value === null || value === "";
};
const isNotEmpty = (value) => {
  return !isEmpty(value);
};
const isEmptyObject = (value) => {
  return Object.keys(value).length === 0;
};
const isArray = (value) => {
  return Object.prototype.toString.call(value) === "[object Array]";
};
const isObject = (value) => {
  return Object.prototype.toString.call(value) === "[object Object]";
};
const isString = (value) => {
  return Object.prototype.toString.call(value) === "[object String]";
};
const isNumber = (value) => {
  return Object.prototype.toString.call(value) === "[object Number]";
};
const isJson = (value) => {
  try {
    const obj = JSON.parse(value);
    return !!(typeof obj === "object" && obj);
  } catch (e) {
    return false;
  }
};
const downloadFile = (href, filename) => {
  if (href && filename) {
    const a = document.createElement("a");
    a.download = filename;
    a.href = href;
    a.click();
    URL.revokeObjectURL(a.href);
  }
};
const getNextItem = (itemList, index) => {
  let result = {};
  if (index === itemList.length - 1) {
    if (index !== 0) {
      result = itemList[index - 1];
    }
  } else {
    result = itemList[index + 1];
  }
  return result;
};
const durationTimeFormat = (time) => {
  if (!time && typeof time !== "number")
    return "";
  const result = [];
  const seconds = Math.ceil(time / 1e3);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  if (years) {
    result.push(years + "\u5E74");
  }
  if (months % 12) {
    result.push(months % 12 + "\u6708");
  }
  if (days % 365 % 30) {
    result.push(days % 365 % 30 + "\u5929");
  }
  if (hours % 24) {
    result.push(hours % 24 + "\u5C0F\u65F6");
  }
  if (minutes % 60) {
    result.push(minutes % 60 + "\u5206");
  }
  if (seconds % 60) {
    result.push(seconds % 60 + "\u79D2");
  }
  return result.join("");
};
const getQueryString = (key, url) => {
  if (isEmpty(url))
    url = window.location.href;
  const reg = new RegExp("(^|&|\\?)" + key + "=([^&]*)(&|$|#)", "i");
  const r = url.match(reg);
  if (r != null)
    return decodeURIComponent(r[2]);
  return null;
};
const setUrlQuery = (url, query) => {
  if (!url)
    return "";
  if (query) {
    const queryArray = [];
    for (const key in query) {
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        queryArray.push(`${key}=${query[key]}`);
      }
    }
    if (url.includes("?")) {
      url = `${url}&${queryArray.join("&")}`;
    } else {
      url = `${url}?${queryArray.join("&")}`;
    }
  }
  return url;
};
const getLabelByValue = (value, options, optionProps) => {
  var _a;
  return (_a = options.find((option) => option[optionProps.value] === value)) == null ? void 0 : _a[optionProps.label];
};
const getFieldValue = (target, propertyName) => {
  if (isNotEmpty(propertyName)) {
    const keys = propertyName.split(".");
    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1 && isNotEmpty(target[keys[i]])) {
        return target[keys[i]];
      } else if (isObject(target[keys[i]])) {
        target = target[keys[i]];
      } else if (isArray(target[keys[i]])) {
        if (isNaN(Number(keys[i])))
          target = target[keys[i]];
      } else {
        return void 0;
      }
    }
  } else {
    return void 0;
  }
};
const setFieldValue = (target, propertyName, value, hasArray = false) => {
  if (isNotEmpty(propertyName)) {
    const keys = propertyName.split(".");
    const len = keys.length - 1;
    keys.reduce((cur, key, index) => {
      if (index < len) {
        if (!cur[key]) {
          if (hasArray && !isNaN(Number(keys[index + 1]))) {
            cur[key] = [];
          } else {
            cur[key] = {};
          }
        }
      }
      if (index === len) {
        cur[key] = value;
      }
      return cur[key];
    }, target);
  }
};
const isMap = (value) => {
  return value instanceof Map;
};
const getValueByKey = (key, mapping) => {
  if (isMap(mapping)) {
    return mapping.get(key);
  } else {
    return mapping[key];
  }
};
const getKeyByValue = (value, mapping) => {
  if (isMap(mapping)) {
    for (const [key, mapValue] of mapping) {
      if (mapValue === value) {
        return key;
      }
    }
  } else {
    for (const key in mapping) {
      if (mapping[key] === value) {
        return key;
      }
    }
  }
};
const getValueMapping = (value, mapping = {}, valueType) => {
  let result;
  if (valueType === "value") {
    Object.keys(mapping).forEach((key) => {
      const mapValue = mapping[key];
      if (mapValue === value) {
        result = key;
      }
    });
  } else {
    const mapValue = mapping[value];
    if (isNotEmpty(mapValue)) {
      result = mapValue;
    }
  }
  return result;
};
const depthFirstSearchTree = (tree, value, key, children = "children", depth = 0) => {
  depth++;
  if (!tree)
    return;
  if (getFieldValue(tree, key) === value) {
    const _a = tree, useObject = __objRest(_a, ["children"]);
    return [useObject];
  }
  if (depth > 9)
    return;
  if (!tree[children])
    return;
  const loop = tree[children].length;
  for (let i = 0; i < loop; i++) {
    const result = depthFirstSearchTree(tree[children][i], value, key, children, depth);
    if (result) {
      const _b = tree, useObject = __objRest(_b, ["children"]);
      result.unshift(useObject);
      return result;
    }
  }
};
const depthFirstSearchIndexTree = (tree, value, key, children = "children", depth = 0) => {
  depth++;
  if (!isArray(tree))
    throw Error("tree must be array");
  if (tree.length === 0)
    return;
  tree = [].concat(tree);
  const loop = tree.length;
  for (let i = 0; i < loop; i++) {
    if (getFieldValue(tree[i], key) === value) {
      return [i];
    }
    if (depth > 9)
      continue;
    const childrenTree = getFieldValue(tree[i], children);
    if (!childrenTree)
      continue;
    const result = depthFirstSearchIndexTree(childrenTree, value, key, children, depth);
    if (result) {
      result.unshift(i);
      return result;
    }
  }
};
const getPropertyKeyByPath = (path, treeProps) => {
  const { children } = treeProps;
  return path.join(`.${children}.`);
};
const getUsingConfig = (...args) => {
  for (let i = 0; i < args.length; i++) {
    const value = args[i];
    if (isNotEmpty(value)) {
      return value;
    }
  }
};
const getEquipmentType = () => {
  if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i)) {
    return "mobile";
  } else {
    return "pc";
  }
};
const addThousandSeparator = (number, separator = "") => {
  const arr = (number + "").split(".");
  arr[0] = arr[0].replace(/(\d)(?=(?:\d{3})+$)/g, `$1${separator}`);
  return arr.join(".");
};
const getValueByTemplate = (template, object) => {
  if (typeof template !== "string") {
    return template;
  }
  return template == null ? void 0 : template.replace(/\${([^}]+)}/g, (_, key) => {
    const val = getFieldValue(object, key);
    return isNotEmpty(val) ? val : `\${${key}}`;
  });
};
class Strategy {
  constructor({ strategies, message } = {}) {
    __publicField(this, "strategies", {});
    __publicField(this, "message", "");
    this.strategies = strategies || {};
    this.message = message;
  }
  setStrategy(type, strategy) {
    this.strategies[type] = strategy;
  }
  execute(type, ...args) {
    if (!type || !this.strategies[type]) {
      throw Error(this.message);
    }
    this.strategies[type](...args);
  }
}
const subStr = (string, start, end) => {
  if (typeof string !== "string") {
    throw Error("param is not string");
  }
  if (end < 0) {
    const len = string.length;
    if (len + end <= 0)
      return "";
    end = len + end;
  }
  return string.substring(start, end);
};

export { Strategy, addThousandSeparator, cloneDeep, debounce, depthFirstSearchIndexTree, depthFirstSearchTree, downloadFile, durationTimeFormat, getEquipmentType, getFieldValue, getKeyByValue, getLabelByValue, getNextItem, getPropertyKeyByPath, getQueryString, getUsingConfig, getValueByKey, getValueByTemplate, getValueMapping, isArray, isEmpty, isEmptyObject, isInputEmpty, isJson, isNotEmpty, isNumber, isObject, isString, objectEqual, setFieldValue, setUrlQuery, subStr, throttle, toTreeData, toUpperFirstCase };
