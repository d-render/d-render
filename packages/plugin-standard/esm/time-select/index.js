import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElTimeSelect } from 'element-plus';

var index = {
  name: "StandardDate",
  setup() {
    const elInputProps = [];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": ElTimeSelect
    }, null);
  }
};

export { index as default };
