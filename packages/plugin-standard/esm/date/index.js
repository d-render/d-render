import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElDatePicker } from 'element-plus';

var index = {
  name: "StandardDate",
  setup() {
    const elInputProps = [["inputType", "type"], "readonly", "size", "editable", "clearable", "placeholder", "startPlaceholder", "endPlaceholder", "format", "popperClass", "popperOptions", "rangeSeparator", "defaultTime", "valueFormat", "id", "name", "unlinkPanels", "prefixIcon", "clearIcon", "validateEvent", "disabledDate", "shortcuts", "cellClassName", "teleported"];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": ElDatePicker
    }, null);
  }
};

export { index as default };
