import { createVNode, computed, isVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElCheckboxButton, ElCheckbox, ElCheckboxGroup } from 'element-plus';

function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
const CheckBox = {
  setup(props, {
    attrs
  }) {
    const UComponent = computed(() => attrs.isButton ? ElCheckboxButton : ElCheckbox);
    return () => {
      let _slot;
      return createVNode(ElCheckboxGroup, null, _isSlot(_slot = attrs.options.map((option) => {
        return createVNode(UComponent.value, {
          "key": option.value,
          "label": option.value
        }, {
          default: () => [option.label]
        });
      })) ? _slot : {
        default: () => [_slot]
      });
    };
  }
};
var index = {
  name: "StandardCheckbox",
  setup() {
    const elInputProps = ["isButton", "options", "size", "min", "max", "label", "text-color", "fill", "tag", "validateEvent"];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": CheckBox
    }, null);
  }
};

export { index as default };
