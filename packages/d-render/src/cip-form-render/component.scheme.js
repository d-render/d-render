export const propsScheme = {
  model: {
    type: Object,
    default: () => ({})
  },
  scheme: {
    type: Object
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
