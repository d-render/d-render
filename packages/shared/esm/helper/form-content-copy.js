import { v4 } from 'uuid';
import { cloneDeep, toUpperFirstCase } from '../utils';
import { DRender } from './d-render';

const dRender = new DRender();
const twoValueComponentList = [
  "dateRange",
  "timeRange",
  "numberRange",
  "resourceFormTable",
  "dataDictionary",
  "staff",
  "roleDictionary",
  "office",
  "formCountersignPerson",
  "role"
];
const threeValueComponentList = ["roleDictionary"];
const generateFieldKey = (type = "error") => {
  return `${type}_${v4().split("-")[0]}`;
};
const getCopyItem = (item) => {
  const result = cloneDeep(item);
  const type = item.config.type;
  const sign = generateFieldKey(type);
  result.id = sign;
  result.key = sign;
  if (twoValueComponentList.includes(type)) {
    result.config.otherKey = `other${toUpperFirstCase(sign)}`;
  }
  if (threeValueComponentList.includes(type)) {
    result.config.otherKey = [`other${toUpperFirstCase(sign)}`, `extra${toUpperFirstCase(sign)}`];
  }
  return result;
};
const getCopyLayout = (layout) => {
  var _a, _b;
  const newLayout = getCopyItem(layout);
  (_b = (_a = newLayout.config.options) == null ? void 0 : _a.forEach) == null ? void 0 : _b.call(_a, (option) => {
    const children = option.children || [];
    if (children.length > 0) {
      option.children = children.map(getCopyRow);
    }
  });
  return newLayout;
};
const getCopyTable = (table) => {
  var _a;
  const newTable = getCopyItem(table);
  const options = ((_a = newTable.config) == null ? void 0 : _a.options) || [];
  if ((options == null ? void 0 : options.length) > 0) {
    newTable.config.options = options.map(getCopyRow);
  }
  return newTable;
};
const getCopyRow = (row) => {
  var _a;
  const type = (_a = row.config) == null ? void 0 : _a.type;
  if (dRender.isLayoutType(type)) {
    return getCopyLayout(row);
  } else if (type === "table") {
    return getCopyTable(row);
  } else {
    return getCopyItem(row);
  }
};
const getTableItem = (item) => {
  const result = cloneDeep(item);
  const type = item.config.type;
  result.id = item.config.key;
  result.key = item.config.key;
  if (twoValueComponentList.includes(type)) {
    result.config.otherKey = `other${toUpperFirstCase(item.config.key)}`;
  }
  return result;
};

export { generateFieldKey, getCopyItem, getCopyLayout, getCopyRow, getCopyTable, getTableItem, threeValueComponentList, twoValueComponentList };
