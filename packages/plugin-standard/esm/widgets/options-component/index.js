import { computed, createVNode, isVNode, mergeProps } from 'vue';
import { isObject, getFieldValue } from '@d-render/shared';

function _isSlot(s) {
  return typeof s === "function" || Object.prototype.toString.call(s) === "[object Object]" && !isVNode(s);
}
const OptionComponent = {
  props: {
    item: {},
    option: [Object, String, Number],
    index: Number,
    optionProps: Object,
    isObjectOption: Boolean,
    config: Object,
    optionValueProp: String,
    optionConfig: Object
  },
  setup(props) {
    const ItemComponent = computed(() => props.item);
    const labelBridge = computed(() => {
      return getFieldValue(props.option, props.optionProps.label);
    });
    const valueBridge = computed(() => {
      return getFieldValue(props.option, props.optionProps.value);
    });
    const disabledBridge = computed(() => {
      return getFieldValue(props.option, props.optionProps.disabled);
    });
    const defaultSlot = computed(() => {
      var _a;
      const slot = (_a = props.optionProps.slots) == null ? void 0 : _a.default;
      if (slot) {
        return slot({
          option: props.option,
          index: props.index
        });
      } else {
        return labelBridge.value;
      }
    });
    return () => createVNode(ItemComponent.value, mergeProps(props.config, {
      [props.optionValueProp || "value"]: valueBridge.value
    }, {
      "disabled": typeof disabledBridge.value === "function" ? disabledBridge.value(props.option) : disabledBridge.value
    }), {
      default: () => [defaultSlot.value]
    });
  }
};
var index = {
  name: "OptionsComponents",
  props: {
    group: {},
    item: {},
    options: Array,
    optionProps: {},
    optionValueProp: {},
    optionConfig: {}
  },
  setup(props) {
    const GroupComponent = computed(() => props.group);
    const isObjectOption = computed(() => isObject(props.options[0]));
    const optionPropsBridge = computed(() => Object.assign({}, {
      value: "value",
      label: "label",
      children: "children",
      disabled: "disabled"
    }, props.optionProps));
    return () => {
      let _slot;
      return createVNode(GroupComponent.value, null, _isSlot(_slot = props.options.map((option, i) => {
        return createVNode(OptionComponent, {
          "key": getFieldValue(option, optionPropsBridge.value.value),
          "item": props.item,
          "index": i,
          "option": option,
          "isObjectOption": isObjectOption.value,
          "config": props.optionConfig,
          "optionValueProp": props.optionValueProp,
          "optionProps": optionPropsBridge.value
        }, null);
      })) ? _slot : {
        default: () => [_slot]
      });
    };
  }
};

export { index as default };
