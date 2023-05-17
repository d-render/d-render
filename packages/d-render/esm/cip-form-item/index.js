import { onErrorCaptured, computed, unref, toRef, ref, createVNode, h, createTextVNode } from 'vue';
import { ElFormItem, ElTooltip } from 'element-plus';
import { useCipConfig, useElFormInject, useFormInject, isEmptyObject, isEmpty, isInputEmpty } from '@d-render/shared';
import { useWatchFieldDepend } from './hooks/use-field-depend';
import { useFieldValue, useSteamUpdateValues } from './hooks/use-model-change';
import { useRules } from './hooks/use-field-rules';
import { UpdateModelQueue, getH5InputComponent, getInputComponent, getViewComponent, isHideLabel, getLabelWidth } from './util';

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
  name: "CipFormItem",
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
    readonly: Boolean,
    // 是否只读-即查看模式
    customSlots: Function,
    showTemplate: {
      // 是否展示模版值[注：表单设计中使用]
      type: Boolean,
      default: false
    },
    tableDependOnValues: Object,
    inTable: {
      type: Boolean,
      default: false
    },
    componentKey: String,
    grid: [Number, Boolean],
    tableData: Array,
    labelPosition: {
      type: String,
      validate: (val) => ["top", "right", "left"].includes(val)
    },
    onSearch: Function
    // 供CipSearchForm使用
  },
  emits: ["update:model"],
  setup(props, context) {
    onErrorCaptured((e) => {
      process.env.NODE_ENV === "development" && console.log(e);
      return false;
    });
    const cipConfig = useCipConfig();
    const elForm = useElFormInject();
    const cipForm = useFormInject();
    const equipment = computed(() => {
      return unref(cipForm.equipment) || "pc";
    });
    const notInForm = computed(() => {
      return isEmptyObject(elForm);
    });
    const updateModel = (value) => {
      context.emit("update:model", value);
    };
    const updateModelQueue = new UpdateModelQueue(() => props.model, updateModel);
    const status = computed(() => {
      const config = formItemConfig.value;
      if (props.readonly) {
        if (config.readable === false)
          return "hidden";
        return "read";
      }
      if (isEmpty(config.readable) && isEmpty(config.writable)) {
        return "read-write";
      }
      if (config.writable) {
        return "read-write";
      } else if (config.readable) {
        return "read";
      } else {
        return "hidden";
      }
    });
    const formItemConfig = computed(() => {
      return runningConfig.value || props.config;
    });
    const model = toRef(props, "model");
    const fieldKey = toRef(props, "fieldKey");
    const changeEffect = computed(() => {
      return formItemConfig.value.changeEffect;
    });
    const [modelValue, updateModelValue] = useFieldValue(fieldKey, model, updateModelQueue, changeEffect);
    const otherKey = computed(() => {
      var _a;
      return (_a = formItemConfig.value) == null ? void 0 : _a.otherKey;
    });
    const [otherValue, updateOtherValue] = useFieldValue(otherKey, model, updateModelQueue);
    const {
      values,
      streamUpdateModel,
      clearValues
    } = useSteamUpdateValues(fieldKey, otherKey, model, updateModel, changeEffect);
    const {
      changeCount,
      dependOnValues,
      outDependOnValues,
      runningConfig
    } = useWatchFieldDepend(props, context, {
      updateModelValue,
      updateOtherValue,
      clearValues
    });
    const readonly = toRef(props, "readonly");
    const {
      usingRules,
      rules
    } = useRules(formItemConfig, readonly, status, otherValue, dependOnValues, outDependOnValues);
    const childStatus = ref(true);
    const formItemLabel = () => {
      if (formItemConfig.value.hideLabel === true || isEmpty(formItemConfig.value.label))
        return "";
      const labelId = formItemConfig.value.directory ? props.fieldKey : void 0;
      const result = [h("span", {
        class: {
          "is-readonly": props.readonly
        },
        id: labelId
      }, [formItemConfig.value.label])];
      if (formItemConfig.value.description) {
        const descriptionComp = createVNode(ElTooltip, {
          "effect": formItemConfig.value.descriptionEffect || "light",
          "placement": "top"
        }, {
          content: () => formItemConfig.value.description,
          default: () => createVNode("i", {
            "class": "el-icon-question",
            "style": "margin-left:2px;line-height: inherit;"
          }, null)
        });
        result.push(descriptionComp);
      }
      if (usingRules.value && formItemConfig.value.required) {
        const requiredAsterisk = createVNode("span", {
          "class": "cip-danger-color"
        }, [createTextVNode("*")]);
        result.unshift(requiredAsterisk);
      }
      if (elForm.labelSuffix) {
        result.push(elForm.labelSuffix);
      }
      return h("div", {
        class: ["cip-form-item__label"],
        style: __spreadValues({
          width: "100%"
        }, formItemConfig.value.labelStyle)
      }, result);
    };
    const inlineErrorMessage = computed(() => {
      return props.inTable || cipForm.equipment === "mobile";
    });
    const errorMessageNode = ({
      error
    }) => {
      if (!inlineErrorMessage.value)
        return null;
      return createVNode(ElTooltip, {
        "content": error
      }, {
        default: () => [createVNode("i", {
          "class": "el-icon-warning cip-danger-color ",
          "style": {
            outline: "none",
            border: "none"
          }
        }, null)]
      });
    };
    const labelPosition = computed(() => {
      var _a;
      if (!isEmpty(formItemConfig.value.labelPosition)) {
        return formItemConfig.value.labelPosition;
      }
      if (props.labelPosition)
        return props.labelPosition;
      return (_a = unref(cipForm.labelPosition)) != null ? _a : "right";
    });
    const isLabelPositionTop = computed(() => {
      return labelPosition.value === "top";
    });
    const renderItemInput = () => {
      if (props.customSlots) {
        return props.customSlots({
          fieldKey: props.fieldKey,
          modelValue: modelValue.value,
          updateModel: updateModelValue,
          // 即将废弃，此处名字与实际功能不符合
          updateModelValue
        });
      }
      const type = formItemConfig.value.type || "default";
      const componentProps = {
        key: props.componentKey,
        id: props.fieldKey,
        fieldKey: props.fieldKey,
        modelValue: modelValue.value,
        otherValue: otherValue.value,
        values: values.value,
        // model: model.value, // 即将废弃
        changeCount: changeCount.value,
        config: formItemConfig.value,
        usingRules: usingRules.value,
        rules: rules.value,
        dependOnValues: dependOnValues.value,
        outDependOnValues: outDependOnValues.value,
        disabled: formItemConfig.value.importantDisabled !== void 0 ? formItemConfig.value.importantDisabled : formItemConfig.value.disabled,
        showTemplate: props.showTemplate,
        tableData: props.tableData,
        class: "cip-form-item__input",
        onStatusChange: (status2) => {
          childStatus.value = status2;
        },
        onSearch: props.onSearch
      };
      if (status.value === "read-write") {
        const inputComponentProps = __spreadProps(__spreadValues({}, componentProps), {
          // 'onUpdate:modelValue': updateModelValue,
          // 'onUpdate:otherValue': updateOtherValue,
          "onStreamUpdate:model": (...args) => {
            console.log("onStreamUpdate:model", args);
            streamUpdateModel(...args);
          }
        });
        if (unref(cipForm.equipment) === "mobile") {
          return h(getH5InputComponent(type), inputComponentProps);
        } else {
          return h(getInputComponent(type), inputComponentProps);
        }
      } else {
        if (isInputEmpty(componentProps.modelValue)) {
          if (props.inTable && cipConfig.table.defaultViewValue) {
            componentProps.modelValue = cipConfig.table.defaultViewValue;
          }
          if (cipConfig.defaultViewValue) {
            componentProps.modelValue = cipConfig.defaultViewValue;
          }
        }
        return h(getViewComponent(type), componentProps);
      }
    };
    const formItem = () => {
      return h(ElFormItem, {
        class: [`label-pos--${labelPosition.value}`, {
          "pos-top": isLabelPositionTop.value,
          // 'pos-top--padding': labelPositionTopPadding, 暂时关闭position === top时内容的缩进
          "hide-label": isHideLabel(formItemConfig.value),
          "content--end": formItemConfig.value.contentEnd
        }],
        prop: formItemConfig.value.ruleKey || props.fieldKey,
        // 子表单内的输入框会生成一个ruleKey
        rules: rules.value,
        labelWidth: getLabelWidth(formItemConfig.value),
        inlineMessage: inlineErrorMessage.value
      }, {
        label: formItemLabel,
        error: errorMessageNode,
        default: renderItemInput
      });
    };
    const cipFormStyle = computed(() => {
      if (props.grid) {
        return __spreadValues({
          gridColumn: `span ${formItemConfig.value.span || 1}`
        }, formItemConfig.value.itemStyle);
      } else {
        return elForm.inline && !props.inTable ? formItemConfig.value.style : formItemConfig.value.itemStyle;
      }
    });
    return () => {
      if (status.value === "hidden")
        return null;
      if (props.inTable && status.value === "read")
        return renderItemInput();
      if (notInForm.value)
        return renderItemInput();
      return createVNode("div", {
        "style": cipFormStyle.value,
        "class": [
          "cip-form-item",
          "el-form-item__wrapper",
          "ep-form-item__wrapper",
          // 支持namespace ep
          `cip-form-item--${equipment.value}`,
          {
            "cip-form-item--label-position-top": isLabelPositionTop.value,
            "cip-form-item--hidden": !childStatus.value || formItemConfig.value.hideItem,
            "cip-form-item--in-table": props.inTable,
            "cip-form-item--border": props.config.border !== false
          }
        ]
      }, [formItem()]);
    };
  }
};

export { index as default };
