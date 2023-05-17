import { computed, createVNode, mergeProps } from 'vue';
import { useFormInput, useInputProps, useElementFormEvent, formInputProps } from '@d-render/shared';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var index = {
  name: "CipFormInputTransform",
  props: __spreadProps(__spreadValues({}, formInputProps), {
    inputPropsConfig: {
      type: Array,
      default: () => []
    },
    formInputOptions: {
      type: Object,
      default: void 0
    },
    comp: {
      type: [Object, Function],
      required: true
    }
  }),
  // emits: formInputEmits,
  setup(props, context) {
    const {
      width,
      proxyValue,
      proxyOtherValue
    } = useFormInput(props, context, props.formInputOptions);
    const otherValueListener = proxyOtherValue.reduce((acc, v, idx) => {
      acc[`onUpdate:other${idx}`] = ($event) => {
        v.value = $event;
      };
      return acc;
    }, {});
    const otherValueProps = computed(() => proxyOtherValue.reduce((acc, v, idx) => {
      acc[`other${idx}`] = v.value;
      return acc;
    }, {}));
    const inputProps = useInputProps(props, props.inputPropsConfig);
    const {
      handleChange,
      handleBlur
    } = useElementFormEvent();
    if (!props.comp)
      return new Error("comp must be an component");
    return () => {
      const Comp = props.comp;
      return createVNode(Comp, mergeProps(inputProps.value, otherValueProps.value, otherValueListener, {
        "disabled": props.disabled,
        "dependOnValues": props.dependOnValues,
        "outDependOnValues": props.outDependOnValues,
        "tableData": props.tableData,
        "onSearch": props.onSearch,
        "style": {
          width: width.value
        },
        "values": props.values,
        "modelValue": proxyValue.value,
        "onUpdate:modelValue": ($event) => proxyValue.value = $event,
        "onChange": (e) => {
          handleChange();
        },
        "onBlur": (e) => {
          handleBlur();
        }
      }), null);
    };
  }
};

export { index as default };
