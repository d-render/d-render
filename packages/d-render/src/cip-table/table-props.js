export const tableProps = {
  data: { // table的数据
    type: Array,
    default: () => []
  },
  size: { type: String, validate: (val) => ['large', 'default', 'small'].includes(val) },
  border: { type: Boolean, default: undefined },
  columns: { type: Array, default: () => [] }, // table 数据列的配置
  offset: Number, // table第一行数据的偏移量, 设置该值将在左侧添加一个序号列
  hideIndex: Boolean, // 补充控制序号列，优先级高于offset,即当offset存在但hideIndex为true时依然不渲染序号列
  indexFixed: Boolean, // 序号列左侧悬浮
  height: String, // table的高度 可使用css的calc方法
  selectType: { // table 是否可以选择
    type: String,
    validate: (val) => ['checkbox', 'radio'].includes(val)
  },
  selectable: Function, // table 是否可复选 需要与selectType = checkbox 配合使用 function(row,index)
  selectRadio: [String, Number], // table为单选时的选中列的value
  selectLabel: String, // table为单选时的选中列的展示值
  selectColumns: Array, // ERROR ?? 似乎没什么用
  tableHeaderLabel: String, // table所有列是否添加一个父title
  inForm: Boolean, // 是否为表单的输入或展示
  rowKey: [String, Function], // 每一行的唯一主键 可为空 [建议写]
  treeProps: { // 树形table的配置 { children: 'children', hasChildren: 'hasChildren' }
    type: Object,
    default: () => ({})
  },
  defaultExpendAll: Boolean,
  withTableHandle: Boolean, // 是否需要自带的处理列
  handlerWidth: { // 自带的处理列的宽度
    type: String
    // default: '136px'
  },
  handlerLimit: { type: Number, default: 3 },
  fieldKey: String, // form下使用时的data所在的键值
  ruleKey: String, // form下当前data的检验规则key, 此处为空时使用fieldKey
  dependOnValues: Object // form 下对外部数据的依赖
}
