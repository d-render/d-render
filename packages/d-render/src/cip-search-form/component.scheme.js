export const propsScheme = {
  model: {
    type: Object,
    default: ()=> ({})
  },
  fieldList: {
    type: Array,
    tsType: 'import(\'@d-render/shared\').IFormConfig'
  },
  hideSearch: {
    type: Boolean
  },
  handleAbsolute: {
    type: Boolean
  },
  collapse: {
    type: Boolean,
    default: true
  },
  searchButtonText: {
    type: String
  },
  searchReset: {
    type: Boolean,
    default: undefined
  },
  grid: {
    type: [String, Boolean]
  },
  equipment: {
    type: String,
    default: 'pc',
    options: ['pc', 'mobile']
  },
  labelPosition: {
    type: String
  },
  completeRow: {
    type: Boolean
  },
  defaultModel: {
    type: Boolean,
    default:  ()=> ({})
  }
}
export const eventsScheme = {
  'update:modelValue': {
    cbVar: 'value'
  }
}
export const slotsScheme = {
}

export const componentScheme = {
  propsScheme,
  eventsScheme,
  slotsScheme,
  name: "CipSearchForm"
}
