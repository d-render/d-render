import { createVNode } from 'vue';
import { formInputViewProps } from '@d-render/shared';

var view = {
  name: "StandardInputView",
  props: formInputViewProps,
  setup(props) {
    return () => createVNode("span", null, [props.modelValue ? props.modelValue.toString() : ""]);
  }
};

export { view as default };
