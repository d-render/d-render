import { ExtractPropTypes, PropType } from 'vue'
import { IAnyObject, IRenderConfig } from '../../utils'
const commonAttrProps = {
  fieldKey: { type: String },
  modelValue: {},
  otherValue: { },
  values: { type: Array as PropType<Array<unknown>>, default: () => [] },
  dependOnValues: Object as PropType<IAnyObject>,
  outDependOnValues: Object as PropType<IAnyObject>,
  disabled: Boolean,
  showTemplate: {
    type: Boolean,
    default: false
  },
  // model: {},
  changeCount: { type: Number },
  onStatusChange: { },
  config: {
    type: Object as PropType<IRenderConfig>,
    default: () => ({})
  },
  usingRules: Boolean,
  rules: Array,
  // 防止attr隐式贯穿导致的继承问题
  error: {},
  id: {},
  tableData: { type: Array as PropType<Array<IAnyObject>> }, // table子组件特有属性
  onSearch: { type: Function as PropType<()=>void> } // 供CipSearchForm使用
}

export type InputProps = ExtractPropTypes<typeof commonAttrProps>
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
