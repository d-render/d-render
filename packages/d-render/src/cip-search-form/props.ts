import type { ExtractPropTypes, PropType } from 'vue'
import type { IAnyObject, IFormConfig } from '@d-render/shared'
export const cipSearchFormProps = {
  model: Object,
  fieldList: { type: Array as PropType<Array<IFormConfig>>, required: true },
  hideSearch: Boolean, // 是否隐藏search按钮
  handleAbsolute: Boolean, // 在pageCurd下的特殊行为
  collapse: { type: Boolean, default: undefined }, // 是否开启展开/收缩
  searchButtonText: String,
  searchReset: { // 是否开启重置
    type: Boolean,
    default: undefined
  },
  grid: Number, // 网格布局时的列数 [注：2.0版本开始强制开启grid]
  equipment: String,
  labelPosition: String,
  completeRow: Boolean, // 是否为完整的一行
  defaultModel: Object as PropType<IAnyObject>, // 重置后载入默认设置model
  quirks: { type: Boolean, default: undefined }, // 是否开启怪异模式
  // form下的特殊模式
  inForm: { type: Boolean }, // 是否在form内
  // fieldKey: String, // form下使用时的data所在的键值
  // ruleKey: String, // form下当前data的检验规则key, 此处为空时使用fieldKey
  dependOnValues: Object as PropType<IAnyObject>// form 下对外部数据的依赖
}

export type TSearchFormProps = ExtractPropTypes<typeof cipSearchFormProps>
