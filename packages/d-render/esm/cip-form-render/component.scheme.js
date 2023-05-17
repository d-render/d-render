const propsScheme = {
  model: {
    type: Object,
    default: () => ({})
  },
  scheme: {
    type: Object
  },
  equipment: {
    type: String,
    default: "pc",
    options: ["pc", "mobile"]
  }
};
const eventsScheme = {
  "update:model": {
    cbVar: "value"
  }
};
const slotsScheme = {};
const componentScheme = {
  propsScheme,
  eventsScheme,
  slotsScheme,
  name: "CipFormRender"
};

export { componentScheme, eventsScheme, propsScheme, slotsScheme };
