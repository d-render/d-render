import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElColorPicker } from 'element-plus';

var index = {
  name: "StandardColor",
  setup() {
    const elInputProps = ["size", "showAlpha", "colorFormat", "popperClass", "predefine", "validateEvent", "tabindex", "label", "id"];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": ElColorPicker
    }, null);
  }
};

export { index as default };
