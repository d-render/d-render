import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElTree } from 'element-plus';

var index = {
  name: "StandardDate",
  setup() {
    const elInputProps = [];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": ElTree
    }, null);
  }
};

export { index as default };
