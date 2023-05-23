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
  tableData: {}, // table子组件特有属性
  onSearch: {} // 供CipSearchForm使用
}
export const formInputProps = {
  ...commonAttrProps
}

// 不下发也会自动通过attrs下发...
export const formInputViewProps = {
  ...commonAttrProps
}
// 修复fromInputEmits的拼写错误，保留此属性维持兼容性
export const fromInputEmits = ['streamUpdate:model', 'update:modelValue']
export const formInputEmits = fromInputEmits
