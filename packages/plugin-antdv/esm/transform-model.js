import { createVNode } from 'vue';

var transformModel = {
  name: "TransformModel",
  props: {
    modelValue: {},
    comp: {}
  },
  emits: ["update:modelValue"],
  setup(props, {
    emit,
    slots
  }) {
    const emitValue = (val) => {
      emit("update:modelValue", val);
    };
    return () => {
      const Comp = props.comp;
      return createVNode("div", null, [createVNode(Comp, {
        "value": props.modelValue,
        "onUpdate:value": emitValue
      }, null)]);
    };
  }
};

export { transformModel as default };
