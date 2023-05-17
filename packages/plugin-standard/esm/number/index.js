import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElInputNumber } from 'element-plus';

var index = {
  name: "StandardNumber",
  setup() {
    const elInputProps = ["min", "max", "step", "stepStrictly", "precision", "size", "readonly", "disabled", "controls", "name", "label", "placeholder", "id", "valueOnClear", "validateEvent"];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": ElInputNumber
    }, null);
  }
};

export { index as default };
