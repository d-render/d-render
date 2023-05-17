import { createVNode, computed } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElRadioButton, ElRadio, ElRadioGroup } from 'element-plus';
import OptionsComponents from '../widgets/options-component/index';

const Radio = {
  setup(props, {
    attrs
  }) {
    const UComponent = computed(() => attrs.isButton ? ElRadioButton : ElRadio);
    return () => {
      var _a;
      return createVNode(OptionsComponents, {
        "group": ElRadioGroup,
        "item": UComponent.value,
        "options": attrs.options,
        "optionProps": (_a = attrs.config) == null ? void 0 : _a.optionProps,
        "optionValueProp": "label",
        "optionConfig": {
          border: attrs.border
        }
      }, null);
    };
  }
};
var index = {
  name: "StandardRadio",
  setup() {
    const elInputProps = ["options", "optionProps", "isButton", "border", "size", "text-color", "fill", "validateEvent", "label", "name", "id", "optionConfig"];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": Radio
    }, null);
  }
};

export { index as default };
