export const propsScheme = {
  model: {
    type: Object,
    default: () => ({}),
    required: true
  },
  scheme: {
    type: Object,
    required: true
  },
  equipment: {
    type: String,
    default: 'pc',
    options: ['pc', 'mobile']
  }
}
export const eventsScheme = {
  'update:model': {
    cbVar: 'value'
  }
}
export const slotsScheme = {
}

export const componentScheme = {
  propsScheme,
  eventsScheme,
  slotsScheme,
  name: 'CipFormRender'
}
