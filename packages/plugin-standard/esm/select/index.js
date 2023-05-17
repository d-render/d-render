import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElSelect } from 'element-plus';

var index = {
  name: "StandardDate",
  setup() {
    const elInputProps = [];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": ElSelect
    }, null);
  }
};

export { index as default };
