import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElSlider } from 'element-plus';

var index = {
  name: "StandardDate",
  setup() {
    const elInputProps = [];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": ElSlider
    }, null);
  }
};

export { index as default };
