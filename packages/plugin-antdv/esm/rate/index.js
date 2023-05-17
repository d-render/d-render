import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import TransformModel from '../transform-model';
import { Rate } from 'ant-design-vue';

var index = {
  name: "AntRate",
  setup() {
    return () => createVNode(CipFormInputTransform, {
      "comp": createVNode(TransformModel, {
        "comp": Rate
      }, null)
    }, null);
  }
};

export { index as default };
