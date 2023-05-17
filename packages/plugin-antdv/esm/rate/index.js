import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { Rate } from 'ant-design-vue';

var index = {
  name: "AntRate",
  setup() {
    return () => createVNode(CipFormInputTransform, {
      "comp": Rate
    }, null);
  }
};

export { index as default };
