import { createVNode } from 'vue';
import { CipFormInputTransform } from 'd-render';
import { ElCascader } from 'element-plus';

var index = {
  name: "StandardCascader",
  setup() {
    const elInputProps = ["options", "props", "size", "placeholder", "clearable", "showAllLevels", "collapseTags", "collapseTagsTooltip", "separator", "filterable", "filterMethod", "debounce", "beforeFilter", "popperClass", "teleported", "tagType", "validateEvent"];
    return () => createVNode(CipFormInputTransform, {
      "inputPropsConfig": elInputProps,
      "comp": ElCascader
    }, null);
  }
};

export { index as default };
