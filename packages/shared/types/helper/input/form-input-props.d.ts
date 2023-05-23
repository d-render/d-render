type TProps =  {
  fieldKey: {},
  modelValue: {},
  otherValue: {},
  values: { },
  dependOnValues: {},
  outDependOnValues: {},
  disabled: {},
  showTemplate: {},
  changeCount: {},
  onStatusChange: {},
  config: {},
  usingRules: {},
  rules: {},
  // 防止attr隐式贯穿导致的继承问题
  error: {},
  id: {},
  tableData: {}, // table子组件特有属性
  onSearch: {} // 供CipSearchForm使用
}
export const  commonAttrProps: TProps
export const formInputProps: TProps

// 不下发也会自动通过attrs下发...
export const formInputViewProps: TProps
// 修复fromInputEmits的拼写错误，保留此属性维持兼容性
export const fromInputEmits: ['streamUpdate:model', 'update:modelValue']
export const formInputEmits: ['streamUpdate:model', 'update:modelValue']
