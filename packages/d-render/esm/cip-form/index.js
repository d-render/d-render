import { ref, computed, toRefs, h } from 'vue';
import { ElMessage, ElForm } from 'element-plus';
import { DRender, useCipConfig, useCipPageConfig, getUsingConfig, useFormProvide, toUpperFirstCase, getFieldValue } from '@d-render/shared';
import CipFormItem from '../cip-form-item';
import CipFormDirectory from './form-directory';
import CipFormLayout from '../cip-form-layout';

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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const dRender = new DRender();
var index = {
  name: "CipForm",
  props: {
    model: Object,
    fieldList: Array,
    showOnly: Boolean,
    modelKey: {
      type: [String, Function]
    },
    grid: {
      type: [Number, Boolean]
    },
    // 是否开启grid布局
    useDirectory: Boolean,
    labelPosition: String,
    scrollToError: {
      type: Boolean,
      default: true
    },
    equipment: {
      type: String,
      default: "pc",
      validate: (val) => ["pc", "mobile"].includes(val)
    },
    border: {
      type: Boolean,
      default: void 0
    },
    // showOnly + border 将出现边框
    enterHandler: Function,
    // 回车触发回调
    options: Object
  },
  emits: ["update:model", "submit", "cancel"],
  setup(props, context) {
    const uploadQueue = ref({});
    const cipConfig = useCipConfig();
    const Message = computed(() => {
      var _a;
      return (_a = cipConfig.message) != null ? _a : ElMessage;
    });
    const cipPageConfig = useCipPageConfig();
    const _border = computed(() => {
      var _a, _b;
      return getUsingConfig(props.border, (_a = cipPageConfig.form) == null ? void 0 : _a.border, (_b = cipConfig.form) == null ? void 0 : _b.border);
    });
    const _labelPosition = computed(() => {
      var _a, _b;
      if (_border.value && props.showOnly) {
        return "right";
      }
      return getUsingConfig(props.labelPosition, (_a = cipPageConfig.form) == null ? void 0 : _a.labelPosition, (_b = cipConfig.form) == null ? void 0 : _b.labelPosition);
    });
    useFormProvide(props, uploadQueue);
    const directoryConfig = ref([]);
    const {
      model,
      fieldList
    } = toRefs(props);
    const cipFormRef = ref();
    const updateModel = (val) => {
      context.emit("update:model", val);
    };
    const generateComponentKey = (key) => {
      if (props.modelKey) {
        const appendKey = toUpperFirstCase(key);
        if (typeof props.modelKey === "function") {
          return `${props.modelKey(props.model)}${appendKey}`;
        } else {
          const value = getFieldValue(props.model, props.modelKey);
          return `${value || ""}${appendKey}`;
        }
      } else {
        return key;
      }
    };
    const getComponentProps = (key, config) => {
      const componentKey = generateComponentKey(key);
      const componentProps = {
        key: componentKey,
        componentKey,
        model,
        fieldKey: key,
        config,
        readonly: props.showOnly,
        grid: props.grid,
        formLabelPosition: _labelPosition.value,
        labelPosition: _labelPosition.value,
        "onUpdate:model": (val) => {
          if (componentKey === generateComponentKey(key)) {
            updateModel(val);
          }
        }
      };
      if (props.enterHandler) {
        componentProps.onKeyup = (e) => {
          const {
            keyCode
          } = e;
          if (keyCode === 13) {
            props.enterHandler();
          }
        };
      }
      return componentProps;
    };
    const getFormLayout = (componentProps) => {
      return h(CipFormLayout, __spreadProps(__spreadValues({}, componentProps), {
        onValidate: (cb) => {
          validate(cb);
        },
        onSubmit: () => {
          context.emit("submit");
        },
        onCancel: () => {
          context.emit("cancel");
        }
      }), {
        item: ({
          children = [],
          isShow
        } = {}) => {
          return children.map((v) => getFormDefaultSlot(v, isShow));
        }
      });
    };
    const getFormItem = (componentProps) => {
      return h(CipFormItem, componentProps);
    };
    const getFormDefaultSlot = ({
      key,
      config
    } = {}, isShow) => {
      config._isGrid = props.grid;
      config._isShow = isShow;
      if (context.slots[key]) {
        return context.slots[key]({
          key,
          config
        });
      }
      const componentProps = getComponentProps(key, config);
      if (context.slots[`${key}Input`]) {
        return h(CipFormItem, __spreadProps(__spreadValues({}, componentProps), {
          customSlots: context.slots[`${key}Input`]
        }));
      }
      if (dRender.isLayoutType(config.type)) {
        return getFormLayout(componentProps);
      } else {
        if (config.directory) {
          directoryConfig.value[key] = {
            label: config.staticInfo || config.label,
            level: config.directory
          };
        }
        return getFormItem(componentProps);
      }
    };
    const getFormDefaultSlots = () => {
      if (props.useDirectory) {
        return fieldList.value.map((v) => getFormDefaultSlot(v)).concat([h(CipFormDirectory, {
          directory: directoryConfig.value
        })]);
      } else {
        return fieldList.value.map((v) => getFormDefaultSlot(v));
      }
    };
    const validateUpload = () => {
      return new Promise((resolve, reject) => {
        const keys = Object.keys(uploadQueue.value);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (uploadQueue.value[key]) {
            Message.value.error("\u8BF7\u7B49\u5F85\u6587\u4EF6\u4E0A\u4F20", "\u63D0\u793A");
            resolve(false);
            break;
          }
        }
        resolve(true);
      });
    };
    const validateField = (props2, cb) => {
      return cipFormRef.value.validateField(props2, cb);
    };
    const validate = (cb = () => {
    }) => __async(this, null, function* () {
      const isUpload = yield validateUpload();
      if (!isUpload) {
        cb(false);
        throw new Error("\u8BF7\u7B49\u5F85\u6587\u4EF6\u4E0A\u4F20");
      } else {
        return new Promise((resolve, reject) => {
          cipFormRef.value.validate((isValid, invalidFields) => __async(this, null, function* () {
            if (typeof cb === "function")
              cb(isValid, invalidFields);
            isValid ? resolve(isValid) : reject(isValid);
          }));
        });
      }
    });
    const clearValidate = () => {
      var _a;
      return (_a = cipFormRef.value) == null ? void 0 : _a.clearValidate();
    };
    context.expose({
      validateUpload,
      validateField,
      validate,
      clearValidate
    });
    return () => h(ElForm, __spreadProps(__spreadValues({}, context.attrs), {
      ref: cipFormRef,
      hideRequiredAsterisk: true,
      model,
      // 待进行测试 使用model.value后数据是否正常
      class: ["cip-form", `cip-form--${props.equipment}`, {
        "cip-form--grid": props.grid,
        "cip-form--border": _border.value && props.showOnly,
        "cip-form--readonly": props.showOnly
      }],
      style: {
        gridTemplateColumns: `repeat(${typeof props.grid === "number" ? props.grid : 3},1fr)`
      },
      size: "default",
      // labelPosition: _labelPosition.value,
      scrollToError: props.scrollToError,
      onSubmit: (ev) => {
        ev.preventDefault();
      }
    }), {
      default: () => {
        var _a, _b;
        return [getFormDefaultSlots(), (_b = (_a = context.slots).default) == null ? void 0 : _b.call(_a)];
      }
    });
  }
};

export { index as default };
