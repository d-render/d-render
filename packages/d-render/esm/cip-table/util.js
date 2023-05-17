import { getFieldValue, isArray, getPropertyKeyByPath as getPropertyKeyByPath$1, isNotEmpty } from '@d-render/shared';
import { sizeCellConfig } from './config';

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
const analyseData = (list = [], treeProps, count = 0, parentPath = []) => {
  return list.reduce((acc, item, index) => {
    const path = parentPath.concat(index);
    acc[count] = path;
    count++;
    const children = getFieldValue(item, treeProps.children);
    if (isArray(children)) {
      const indexed = analyseData(children, treeProps, count, path);
      acc = Object.assign(acc, indexed);
      count += Object.keys(indexed).length;
    }
    return acc;
  }, {});
};
const getPropertyKeyByPath = getPropertyKeyByPath$1;
const calculateCurrentWidth = (size = "default", standardSize = "default", width) => {
  if (size === standardSize)
    return width;
  const standardConfig = sizeCellConfig[standardSize];
  const x = (width - standardConfig.padding * 2) / standardConfig.fontSize;
  const currentConfig = sizeCellConfig[size];
  return x * currentConfig.fontSize + currentConfig.padding * 2;
};
const generateChildInfo = (child, childrenKey) => {
  return Object.keys(child).reduce((acc, key) => {
    acc[`${childrenKey}_${key}`] = child[key];
    return acc;
  }, {});
};
const getExpendData = (data, childrenKey) => {
  return data.reduce((acc, v) => {
    const children = v[childrenKey].map((child) => __spreadValues(__spreadValues({}, v), generateChildInfo(child, childrenKey)));
    if (children.length > 0) {
      children.forEach((child) => {
        child._columns = 0;
      });
      children[0]._columns = children.length;
    }
    acc.push(...children);
    return acc;
  }, []);
};
const generateSpanMethod = (excludeFn) => {
  return ({ row, column, rowIndex, columnIndex }) => {
    if (!excludeFn || excludeFn && !excludeFn({ row, column, rowIndex, columnIndex })) {
      if (isNotEmpty(row._columns)) {
        return [row._columns, 1];
      }
    }
  };
};

export { analyseData, calculateCurrentWidth, generateSpanMethod, getExpendData, getPropertyKeyByPath };
