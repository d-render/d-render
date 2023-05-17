export const propsScheme = {
  data: {
    type: Array,
    default: () => []
  },
  size: {
    type: String,
    options: ['large', 'default', 'small']
  },
  border: { type: Boolean, default: undefined },
  columns: {
    type: Array,
    tsType: 'Array<import(\'@d-render/shared\').IRenderConfig>'
  },
  offset: { type: Number},
  hideIndex: { type: Boolean },
  indexFixed: { type: Boolean },
  height: { type: String },
  selectType: { type: String, options: ['checkbox', 'radio'] },
  selectable: { type: Function },
  selectRadio: { type: [String, Number] },
  selectLabel: { type: String },
  selectColumns: { type: Array },
  tableHeaderLabel: { type: String },
  inForm: { type: Boolean },
  rowKey: { type: [String, Function] },
  treeProps: {
    type: Object,
    default: () => ({})
  },
  defaultExpendAll: { type: Boolean },
  withTableHandle: { type: Boolean },
  handlerWidth: { type: String },
  handlerLimit: { type: Number, default: 3 },
  fieldKey: { type: String },
  ruleKey: { type: String },
  dependOnValues: { type: Object }
}
export const eventsScheme = {
  'update:data': {
    cbVar: 'value'
  },
  sort: {},
  'update:selectColumns': {
    cbVar: 'columns'
  }
}
export const slotsScheme = {
  'default': `{}`
}

export const componentScheme = {
  propsScheme,
  eventsScheme,
  slotsScheme,
  name: "CipTable"
}
