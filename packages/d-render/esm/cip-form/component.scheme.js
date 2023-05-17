const propsScheme = {
  model: {
    type: Object
  },
  fieldList: {
    type: Array,
    tsType: "import('@d-render/shared').IFormConfig"
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
    default: "pc",
    options: ["pc", "mobile"]
  },
  border: {
    type: Boolean,
    default: void 0
  },
  enterHandler: {
    type: Function
  },
  options: {
    type: Object
  }
};
const eventsScheme = {
  "update:modelValue": {
    cbVar: "value"
  }
};
const slotsScheme = {
  "default": `{}`
};
const componentScheme = {
  propsScheme,
  eventsScheme,
  slotsScheme,
  name: "CipForm"
};

export { componentScheme, eventsScheme, propsScheme, slotsScheme };
