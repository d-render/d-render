import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElRate } from 'element-plus';

var index = {
  name: "StandardRate",
  setup() {
    return () => createVNode(CipFormInputTransform, {
      "comp": ElRate
    }, null);
  }
};

export { index as default };
