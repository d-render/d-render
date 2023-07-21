export const cipSearchFormProps = {
  model: Object,
  fieldList: Array,
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
  defaultModel: Object // 重置后载入默认设置model
}
