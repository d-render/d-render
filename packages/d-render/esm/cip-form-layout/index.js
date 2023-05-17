import { toRefs, computed, h } from 'vue';
import { getLayoutViewComponent, getLayoutComponent, getH5LayoutComponent } from './util';
import { useFormInject } from '@d-render/shared';

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
  name: "CipFormLayout",
  props: {
    config: Object,
    // 字段配置信息
    fieldKey: String,
    // 字段名
    model: {
      // 字段所属model
      type: Object,
      default: () => ({})
    },
    grid: {},
    // Number | Boolean
    componentKey: {},
    readonly: Boolean
    // 是否只读-即查看模式
  },
  emits: ["update:model", "validate", "submit", "cancel", "selectItem", "update:config"],
  setup(props, context) {
    const {
      model
    } = toRefs(props);
    const cipForm = useFormInject();
    const cipFormStyle = computed(() => {
      if (props.grid) {
        return {
          gridColumn: `span ${props.config.span}`
        };
      } else {
        return "width: 100%";
      }
    });
    const formLayout = () => {
      const componentProps = {
        class: ["cip-form-layout", {
          "cip-form-layout--hidden": props.config.hideItem
        }],
        model: model.value,
        config: props.config,
        fieldKey: props.fieldKey,
        style: cipFormStyle.value
      };
      const componentType = props.config.type;
      if (props.readonly) {
        return h(getLayoutViewComponent(componentType), componentProps, {
          item: ({
            children,
            index
          }) => {
            var _a, _b;
            return (_b = (_a = context.slots).item) == null ? void 0 : _b.call(_a, {
              children,
              index
            });
          }
        });
      } else {
        const method = cipForm.equipment === "pc" ? getLayoutComponent : getH5LayoutComponent;
        return h(method(componentType), __spreadProps(__spreadValues({}, componentProps), {
          "onUpdate:config": (val) => {
            context.emit("update:config", val);
          },
          onValidate: (fn) => {
            context.emit("validate", fn);
          },
          onSubmit: () => {
            context.emit("submit");
          },
          onCancel: () => {
            context.emit("cancel");
          },
          onSelectItem: (val) => {
            context.emit("selectItem", val);
          }
        }), {
          item: (scope) => {
            var _a, _b;
            return (_b = (_a = context.slots).item) == null ? void 0 : _b.call(_a, scope);
          }
        });
      }
    };
    return () => formLayout();
  }
};

export { index as default };
