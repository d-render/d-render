import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElInput } from 'element-plus';

var index = {
  name: "StandardInput",
  setup() {
    const elInputProps = ["size", "maxlength", "minlength", "showWordLimit", "placeholder", "clearable", "formatter", "parser", "disabled", "size", "prefixIcon", "suffixIcon", "name", "readonly"];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": ElInput
    }, null);
  }
};

export { index as default };
