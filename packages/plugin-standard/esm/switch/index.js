import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElSwitch } from 'element-plus';

var index = {
  name: "StandardDate",
  setup() {
    const elInputProps = [];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": ElSwitch
    }, null);
  }
};

export { index as default };
