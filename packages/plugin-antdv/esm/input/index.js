import { createVNode, mergeProps } from 'vue';
import { Input } from 'ant-design-vue';
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
    const AInput = (props2) => {
      return createVNode(Input, mergeProps(props2, {
        "value": props2.modelValue,
        "onInput": (e) => props2["onUpdate:modelValue"](e.target.value)
      }), null);
    };
    return () => createVNode(CipFormInputTransform, mergeProps(attrs, {
      "inputPropsConfig": aInputProps,
      "comp": AInput
    }), null);
  }
};

export { index as default };
