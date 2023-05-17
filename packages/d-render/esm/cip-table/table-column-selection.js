import { ref, computed, watch, createVNode } from 'vue';
import { ElTableColumn, ElCheckbox } from 'element-plus';
import { getFieldValue, setFieldValue } from '@d-render/shared';

var tableColumnSelection = {
  props: {
    prop: String,
    label: String,
    trueLabel: [String, Number],
    // 不写就是默认的true
    falseLabel: [String, Number],
    // 不写就是默认的false
    selectable: Function,
    data: Array
    // cip-table内置时直接使用 如果不存在时降级从data elTable中获取
  },
  setup(props) {
    const isIndeterminate = ref();
    const allSelected = ref(false);
    const dataBridge = computed(
      () => props.data
      /* ?? elTable.ctx.data */
    );
    watch(dataBridge, (val) => {
      if (props.selectable) {
        val = val.filter((v, i) => props.selectable({
          row: v,
          index: i
        }));
      }
      if (!val || val.length === 0)
        allSelected.value = false;
      if (!val.some((v) => [false, void 0, null].includes(getFieldValue(v, props.prop)))) {
        allSelected.value = true;
        isIndeterminate.value = false;
      } else if (val.some((v) => getFieldValue(v, props.prop) === true)) {
        isIndeterminate.value = true;
        allSelected.value = false;
      } else {
        isIndeterminate.value = false;
        allSelected.value = false;
      }
    }, {
      deep: true
    });
    const handleHeaderCheck = (val) => {
      const selectableData = dataBridge.value.filter((v, i) => props.selectable({
        row: v,
        index: i
      }));
      if (val) {
        selectableData.forEach((v) => {
          setFieldValue(v, props.prop, true);
        });
      } else {
        selectableData.forEach((v) => {
          setFieldValue(v, props.prop, false);
        });
      }
    };
    return () => createVNode(ElTableColumn, {
      "align": "center"
    }, {
      header: ({
        column,
        $index
      }) => createVNode("div", {
        "class": "cip-table-column-selection"
      }, [createVNode(ElCheckbox, {
        "modelValue": allSelected.value,
        "onUpdate:modelValue": (val) => handleHeaderCheck(val),
        "indeterminate": isIndeterminate.value
      }, null), props.label]),
      default: ({
        row,
        $index
      }) => createVNode(ElCheckbox, {
        "modelValue": getFieldValue(row, props.prop),
        "disabled": props.selectable && !props.selectable({
          row,
          index: $index
        }),
        "onUpdate:modelValue": (val) => setFieldValue(row, props.prop, val)
      }, null)
    });
  }
};

export { tableColumnSelection as default };
