export const propsScheme = {
  model: {
    type: Object
  },
  fieldList: {
    type: Array,
    tsType: 'import(\'@d-render/shared\').IFormConfig'
  },
  showOnly: {
    type: Boolean
  },
  modelKey: {
    type: [String, Function]
  },
  grid: {
    type: [String, Boolean]
  },
  useDirectory: {
    type: Boolean
  },
  labelPosition: {
    type: String
  },
  scrollToError: {
    type: Boolean,
    default: true
  },
  equipment: {
    type: String,
    default: 'pc',
    options: ['pc', 'mobile']
  },
  border: {
    type: Boolean,
    default: undefined
  },
  enterHandler: {
    type: Function
  },
  options: {
    type: Object
  }
}
export const eventsScheme = {
  'update:modelValue': {
    cbVar: 'value'
  }
}
export const slotsScheme = {
  'default': `{}`
}

export const componentScheme = {
  propsScheme,
  eventsScheme,
  slotsScheme,
  name: "CipForm"
}
