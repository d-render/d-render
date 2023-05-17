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
const commonAttrProps = {
  fieldKey: {},
  modelValue: {},
  otherValue: {},
  values: { type: Array, default: () => [] },
  dependOnValues: Object,
  outDependOnValues: Object,
  disabled: Boolean,
  showTemplate: {
    type: Boolean,
    default: false
  },
  // model: {},
  changeCount: {},
  onStatusChange: {},
  config: {
    type: Object,
    default: () => ({})
  },
  usingRules: Boolean,
  rules: Array,
  // 防止attr隐式贯穿导致的继承问题
  error: {},
  id: {},
  tableData: {},
  // table子组件特有属性
  onSearch: {}
  // 供CipSearchForm使用
};
const formInputProps = __spreadValues({}, commonAttrProps);
const formInputViewProps = __spreadValues({}, commonAttrProps);
const fromInputEmits = ["streamUpdate:model", "update:modelValue"];
const formInputEmits = fromInputEmits;

export { formInputEmits, formInputProps, formInputViewProps, fromInputEmits };
