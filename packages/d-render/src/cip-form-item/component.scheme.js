export const propsScheme = {
  model: {
    type: Object,
    default: () => ({})
  },
  fieldKey: {
    type: String
  },
  config: {
    type: Object,
    tsType: 'import("@vue/shared").IRenderConfig'
  },
  readonly: {
    type: Boolean,
  },
  customSlots: {
    type: Function,
  },
  showTemplate: {
    type: Boolean,
    default: false
  },
  tableDependOnValues: {
    type: Object
  },
  inTable: {
    type: Boolean,
    default: false
  },
  componentKey: {
    type: String
  },
  grid: {
    type:  [Number, Boolean]
  },
  tableData: {
    type: Array
  },
  labelPosition: {
    type: String,
    options: ['top', 'right', 'left'],
    tsType: 'top'|'right'|'left'
  },
  onSearch: {
    type: Function
  }
}
export const eventsScheme = {
  'update:model': {
    cbVar: 'model'
  }
}
export const slotsScheme = {
}

export const componentScheme = {
  propsScheme,
  eventsScheme,
  slotsScheme,
  name: "CipFormItem"
}
