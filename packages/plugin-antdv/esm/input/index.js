import { createVNode, mergeProps } from 'vue';
import { Input } from 'ant-design-vue';
import TransformModel from '../transform-model';
import { CipFormInputTransform } from 'd-render';

var index = {
  inheritAttrs: false,
  model: {
    prop: "value",
    event: "input"
  },
  name: "AntDVInput",
  setup(props, {
    attrs
  }) {
    const aInputProps = ["size", "maxlength", "minlength", "showWordLimit", "placeholder", "clearable", "formatter", "parser", "disabled", "size", "prefixIcon", "suffixIcon", "name", "readonly"];
    return () => createVNode(CipFormInputTransform, mergeProps(attrs, {
      "inputPropsConfig": aInputProps,
      "comp": createVNode(TransformModel, {
        "comp": Input
      }, null)
    }), null);
  }
};

export { index as default };
