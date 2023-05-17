const propsScheme = {
  model: {
    type: Object,
    default: () => ({})
  },
  fieldList: {
    type: Array,
    tsType: "import('@d-render/shared').IFormConfig"
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
    default: void 0
  },
  grid: {
    type: [String, Boolean]
  },
  equipment: {
    type: String,
    default: "pc",
    options: ["pc", "mobile"]
  },
  labelPosition: {
    type: String
  },
  completeRow: {
    type: Boolean
  },
  defaultModel: {
    type: Boolean,
    default: () => ({})
  }
};
const eventsScheme = {
  "update:modelValue": {
    cbVar: "value"
  }
};
const slotsScheme = {};
const componentScheme = {
  propsScheme,
  eventsScheme,
  slotsScheme,
  name: "CipSearchForm"
};

export { componentScheme, eventsScheme, propsScheme, slotsScheme };
