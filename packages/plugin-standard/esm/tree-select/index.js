import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElTreeSelect } from 'element-plus';

var index = {
  name: "StandardDate",
  setup() {
    const elInputProps = [];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": ElTreeSelect
    }, null);
  }
};

export { index as default };
