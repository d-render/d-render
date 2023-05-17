import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElTransfer } from 'element-plus';

var index = {
  name: "StandardDate",
  setup() {
    const elInputProps = [];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": ElTransfer
    }, null);
  }
};

export { index as default };
