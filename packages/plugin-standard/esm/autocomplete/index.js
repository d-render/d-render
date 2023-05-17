import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElAutocomplete } from 'element-plus';

var index = {
  name: "StandardAutoComplete",
  setup() {
    const elInputProps = ["fetchSuggestions", "placeholder", "clearable", "valueKey", "debounce", "placement", "triggerOnFocus", "selectWhenUnmatched", "name", "label", "hideLoading", "popperClass", "teleported", "highlight-first-item", "fit-input-width"];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": ElAutocomplete
    }, null);
  }
};

export { index as default };
