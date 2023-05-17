const propsScheme = {
  model: {
    type: Object,
    default: () => ({})
  },
  config: {
    type: Array,
    tsType: "import('@d-render/shared').IRenderConfig"
  },
  readonly: {
    type: Boolean
  },
  componentKey: {
    type: [String, Function]
  },
  grid: {
    type: [String, Boolean]
  }
};
const eventsScheme = {
  "update:model": {
    cbVar: "value"
  },
  "validate": {},
  "submit": {},
  "cancel": {},
  "selectItem": {
    cbVar: "item"
  },
  "update:config": {
    cbVar: "config"
  }
};
const slotsScheme = {
  "default": `{}`
};
const componentScheme = {
  propsScheme,
  eventsScheme,
  slotsScheme,
  name: "CipFormLayout"
};

export { componentScheme, eventsScheme, propsScheme, slotsScheme };
