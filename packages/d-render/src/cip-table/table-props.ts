import type { ExtractPropTypes, PropType } from 'vue'
import type { IAnyObject, ITableColumnConfig } from '@d-render/shared'

export interface ITreeProps {
  children: string, hasChildren?: string
}

export const tableProps = {
  data: { // table的数据
    type: Array as PropType<Array<IAnyObject>>,
    required: true,
    default: () => []
  },
  seqLabel: { type: String }, // 序号列的列名，未传时使用 locale `dr.table.index`
  size: { type: String, validate: (val: string) => ['large', 'default', 'small'].includes(val) },
  border: { type: Boolean, default: undefined },
  showDisabledButton: { type: Boolean, default: undefined }, // 是否展示在table中disabled的按钮
  dangerButton: { type: Boolean, default: undefined }, // 是否不讲danger按钮转换为primary按钮
  columns: { type: Array as PropType<Array<ITableColumnConfig>>, default: () => [] }, // table 数据列的配置
  offset: Number, // table第一行数据的偏移量, 设置该值将在左侧添加一个序号列
  hideIndex: Boolean, // 补充控制序号列，优先级高于offset,即当offset存在但hideIndex为true时依然不渲染序号列
  indexFixed: Boolean, // 序号列左侧悬浮
  height: String, // table的高度 可使用css的calc方法
  selectType: { // table 是否可以选择
    type: String,
    validate: (val: string) => ['checkbox', 'radio'].includes(val)
  },
  selectable: Function, // table 是否可复选 需要与selectType = checkbox 配合使用 function(row,index)
  reserveSelection: { type: Boolean, default: false }, // selectType为checkbox时，切换分页(data变化)是否保留跨页选中状态，需配合rowKey使用，默认不开启
  selectRadio: [String, Number], // table为单选时的选中列的value
  selectLabel: String, // table为单选时的选中列的展示值
  selectColumns: Array, // ERROR ?? 似乎没什么用
  tableHeaderLabel: String, // table所有列是否添加一个父title
  inForm: Boolean, // 是否为表单的输入或展示
  rowKey: [String, Function] as PropType<string>, // 每一行的唯一主键 可为空 [建议写]
  treeProps: { // 树形table的配置 { children: 'children', hasChildren: 'hasChildren' }
    type: Object as PropType<{children: string, hasChildren?: string}>,
    default: () => ({})
  },
  defaultExpendAll: Boolean,
  withTableHandle: Boolean, // 是否需要自带的处理列
  handlerWidth: { // 自带的处理列的宽度
    type: [String, Number]
    // default: '136px'
  },
  handlerHeaderAlign: { type: String as PropType<'left' | 'center' | 'right'> },
  handlerAlign: { type: String as PropType<'left' | 'center' | 'right'> },
  handlerLimit: { type: Number, default: 3 },
  fieldKey: String, // form下使用时的data所在的键值
  ruleKey: String, // form下当前data的检验规则key, 此处为空时使用fieldKey
  dependOnValues: Object as PropType<IAnyObject>, // form 下对外部数据的依赖
  editType: { type: String as PropType<'all' | 'row' | 'cell'>, default: 'all' },
  defaultAlign: { type: String as PropType<'left' | 'center' | 'right'> },
  /** 筛选值，单选为 string、多选为 string[]，支持 v-model:filterModel 与搜索表单同步 */
  filterModel: { type: Object as PropType<IAnyObject> }
}

export type TTableProps = ExtractPropTypes<typeof tableProps>
