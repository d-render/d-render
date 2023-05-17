import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElTimePicker } from 'element-plus';

var index = {
  name: "StandardDate",
  setup() {
    const elInputProps = [];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": ElTimePicker
    }, null);
  }
};

export { index as default };
