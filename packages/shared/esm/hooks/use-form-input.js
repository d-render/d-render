import { ref, computed, watch, unref } from 'vue';
import { useElFormItemInject } from './use-form';
import { isNotEmpty, isEmpty, isObject, getUsingConfig, getFieldValue, setFieldValue, isArray, isNumber, getLabelByValue } from '../utils';
import { getFormValueByTemplate, UpdateFormStream } from '../helper';

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
const useUpdateStream = (props, context) => {
  const updateStream = new UpdateFormStream(props, (val) => {
    console.log("streamUpdate:model", val);
    context.emit("streamUpdate:model", val);
  });
  return updateStream;
};
const useProxyOtherValue = (props, maxOtherKey = 1, updateStream) => {
  const result = [];
  for (let i = 0; i < maxOtherKey; i++) {
    const proxyValue = computed({
      get() {
        return props.values[i + 1];
      },
      set(val) {
        updateStream.appendOtherValue(val, i + 1);
        updateStream.end();
      }
    });
    result.push(proxyValue);
  }
  return result;
};
const useFormBasicConfig = (props) => {
  const securityConfig = computed(() => {
    var _a;
    return (_a = props.config) != null ? _a : {};
  });
  const clearable = computed(() => {
    var _a;
    return (_a = securityConfig.value.clearable) != null ? _a : true;
  });
  const width = computed(() => {
    var _a;
    return (_a = securityConfig.value.width) != null ? _a : "100%";
  });
  const inputStyle = computed(() => {
    var _a;
    return (_a = securityConfig.value.inputStyle) != null ? _a : {};
  });
  const placeholder = computed(() => {
    return securityConfig.value.placeholder;
  });
  const noMatchText = computed(() => {
    var _a;
    return (_a = securityConfig.value.noMatchText) != null ? _a : "\u65E0\u76F8\u5173\u5185\u5BB9";
  });
  return {
    securityConfig,
    clearable,
    width,
    placeholder,
    inputStyle,
    noMatchText
  };
};
const useFormInput = (props, context, { fromModelValue, toModelValue, maxOtherKey } = {}) => {
  const inputRef = ref();
  const updateStream = useUpdateStream(props, context);
  const { securityConfig, clearable, width, placeholder, inputStyle, noMatchText } = useFormBasicConfig(props);
  const emitInput = (val) => {
    emitModelValue(val);
  };
  const emitModelValue = (val) => {
    console.log("emitModelValue", val);
    val = isNotEmpty(toModelValue) ? toModelValue(val) : val;
    context.emit("update:modelValue", val);
    updateStream.appendValue(val);
    updateStream.end();
  };
  const emitOtherValue = (val) => {
    updateStream.appendOtherValue(val);
    updateStream.end();
  };
  const proxyOtherValue = useProxyOtherValue(props, maxOtherKey, updateStream);
  const proxyValue = computed({
    // 单值时使用
    get() {
      let modelValue = props.modelValue;
      if (props.values && props.values.length > 0) {
        modelValue = props.values[0];
      }
      return isNotEmpty(fromModelValue) ? fromModelValue(modelValue) : modelValue;
    },
    set(val) {
      emitModelValue(val);
    }
  });
  watch([() => securityConfig.value.defaultValue, () => props.changeCount], ([defaultValue]) => {
    if (props.showTemplate === true) {
      emitInput(defaultValue);
    } else {
      if (isEmpty(props.modelValue) && isNotEmpty(defaultValue)) {
        proxyValue.value = getFormValueByTemplate(defaultValue);
      }
    }
  }, { immediate: true });
  return {
    inputRef,
    inputStyle,
    proxyValue,
    securityConfig,
    emitInput,
    emitModelValue,
    emitOtherValue,
    updateStream,
    proxyOtherValue,
    placeholder,
    clearable,
    width,
    noMatchText
  };
};
const useFormView = (props, { maxOtherKey } = {}) => {
  const { securityConfig, clearable, width, placeholder, inputStyle } = useFormBasicConfig(props);
  const proxyOtherValue = useProxyOtherValue(props, maxOtherKey, () => {
  });
  return {
    securityConfig,
    clearable,
    width,
    inputStyle,
    placeholder,
    proxyOtherValue
  };
};
const useElementFormEvent = () => {
  const elFormItem = useElFormItemInject();
  const handleChange = (val) => {
    var _a;
    console.log("change", elFormItem);
    (_a = elFormItem.validate) == null ? void 0 : _a.call(elFormItem, "change", (...args) => {
      console.log(args);
    });
  };
  const handleBlur = (val) => {
    var _a;
    console.log("blur", elFormItem);
    (_a = elFormItem.validate) == null ? void 0 : _a.call(elFormItem, "blur", (...args) => {
      console.log(args);
    });
  };
  return {
    handleChange,
    handleBlur
  };
};
const secureNewFn = (...params) => {
  const funcBody = params.pop();
  try {
    return new Function(...params, funcBody);
  } catch (error) {
    console.error(error);
    return () => {
    };
  }
};
const judgeUseFn = (key, config, effect) => {
  if (key === "changeValue" && config.changeValueStr) {
    return secureNewFn(
      "dependOnValues",
      "outDependOnValues",
      config.changeValueStr
    );
  }
  if (key === "changeConfig" && config.changeConfigStr) {
    return secureNewFn(
      "config",
      "dependOnValues",
      "outDependOnValues",
      config.changeConfigStr
    );
  }
  if (key === "asyncOptions" && typeof config.asyncOptions === "string") {
    return secureNewFn("dependOnValues", "outDependOnValues", config.asyncOptions);
  }
  if (!effect)
    return config[key];
  if (effect && key in effect) {
    if (typeof effect[key] === "function")
      return effect[key];
    return config[key];
  }
};
const useOptions = (props, multiple, updateStream, context) => {
  var _a, _b;
  const optionProps = computed(() => {
    var _a2, _b2;
    return Object.assign({ label: "label", value: "value", children: "children" }, (_a2 = props.config) == null ? void 0 : _a2.treeProps, (_b2 = props.config) == null ? void 0 : _b2.optionProps);
  });
  const otherKey = computed(() => {
    var _a2;
    return (_a2 = props.config) == null ? void 0 : _a2.otherKey;
  });
  const splitKey = computed(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = props.config) == null ? void 0 : _a2.splitKey) != null ? _b2 : ",";
  });
  const withObject = computed(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = props.config) == null ? void 0 : _a2.withObject) != null ? _b2 : false;
  });
  const realArray = computed(() => {
    var _a2, _b2;
    return (_b2 = (_a2 = props.config) == null ? void 0 : _a2.realArray) != null ? _b2 : false;
  });
  const options = ref([]);
  let unwatch = null;
  const getOptions = (val, outVal) => __async(void 0, null, function* () {
    var _a2, _b2;
    if (props.config.asyncOptions) {
      const asyncFunc = judgeUseFn("asyncOptions", props.config);
      options.value = yield asyncFunc(val, outVal);
    } else {
      options.value = (_b2 = (_a2 = props.config) == null ? void 0 : _a2.options) != null ? _b2 : [];
    }
    if (unwatch)
      unwatch();
    unwatch = watch(() => props.changeCount, () => {
      if (isEmpty(props.modelValue) && props.config.autoSelect && updateStream) {
        const autoValue = isObjectOption.value ? options.value[0][optionProps.value.value] : options.value[0];
        const autoLabel = isObjectOption.value ? options.value[0][optionProps.value.label] : options.value[0];
        updateStream.appendValue(autoValue);
        updateStream.appendOtherValue(autoLabel);
        updateStream.end();
      }
    }, { immediate: true });
  });
  const isObjectOption = computed(() => {
    return isObject(options.value[0]);
  });
  const getOtherValueByValue = (value) => {
    var _a2, _b2, _c;
    if (unref(multiple)) {
      if (withObject.value) {
        return value.map((i) => {
          var _a3, _b3;
          return (_b3 = (_a3 = options.value) == null ? void 0 : _a3.find((v) => v[optionProps.value.value] === i)) != null ? _b3 : {};
        });
      }
      return value.map((val) => {
        var _a3;
        return (_a3 = getLabelByValue(val, options.value, optionProps.value)) != null ? _a3 : val;
      }).join(splitKey.value);
    } else {
      if (withObject.value) {
        return (_b2 = (_a2 = options.value) == null ? void 0 : _a2.find((v) => v[optionProps.value.value] === value)) != null ? _b2 : {};
      }
      return (_c = getLabelByValue(value, options.value, optionProps.value)) != null ? _c : value;
    }
  };
  const getValue = (modelValue) => {
    var _a2, _b2, _c;
    if (unref(multiple)) {
      const modelArray = isArray(modelValue) ? modelValue : modelValue ? modelValue.split(splitKey.value) : [];
      const autoFormat = !(((_a2 = props.config) == null ? void 0 : _a2.multiple) && ((_b2 = props.config) == null ? void 0 : _b2.remote));
      if (autoFormat) {
        const optionCell = isObjectOption.value ? (_c = options.value[0]) == null ? void 0 : _c[optionProps.value.value] : options.value[0];
        if (isNumber(optionCell)) {
          return modelArray.map((i) => parseInt(i));
        } else {
          return modelArray.map((i) => String(i));
        }
      }
      return modelArray;
    } else {
      return modelValue != null ? modelValue : "";
    }
  };
  const getModelValue = (value) => {
    if (unref(multiple)) {
      if (realArray.value) {
        return value;
      } else {
        return isArray(value) ? value.join(splitKey.value) : value;
      }
    } else {
      return value;
    }
  };
  const getOtherValue = (modelValue, value) => {
    if (isObjectOption.value) {
      return getOtherValueByValue(value);
    } else {
      return modelValue;
    }
  };
  if (!((_a = props.config.dependOn) == null ? void 0 : _a.length) && !((_b = props.config.outDependOn) == null ? void 0 : _b.length)) {
    getOptions();
    if (props.config.options) {
      watch(() => props.config.options, (val) => {
        getOptions();
      });
    }
  } else {
    watch([() => props.dependOnValues, () => props.outDependOnValues], ([dependOnValues, outDependOnValues]) => {
      getOptions(dependOnValues || {}, outDependOnValues || {});
    }, { immediate: true });
  }
  const proxyOptionsValue = computed({
    get() {
      return getValue(props.modelValue);
    },
    set(value) {
      const modelValue = getModelValue(value);
      if (context) {
        context.emit("update:modelValue", modelValue);
      }
      if (updateStream) {
        updateStream.appendValue(modelValue);
        if (otherKey.value) {
          const otherValue = getOtherValue(modelValue, value);
          updateStream.appendOtherValue(otherValue);
          if (!unref(multiple)) {
            const checkOption = options.value.find((v) => v[optionProps.value.value] === value);
            updateStream.appendOtherValue(checkOption, 2);
          } else {
            const checkOptions = options.value.filter((v) => value.includes(v[optionProps.value.value]));
            updateStream.appendOtherValue(checkOptions, 2);
          }
        }
        updateStream.end();
      } else {
        console.error("updateStream \u4E0D\u5B58\u5728\uFF0C\u65E0\u6CD5\u66F4\u65B0\u6570\u636E");
      }
    }
  });
  return {
    optionProps,
    options,
    getOptions,
    isObjectOption,
    getValue,
    getModelValue,
    getOtherValue,
    splitKey,
    proxyOptionsValue
  };
};
const useInputProps = (props, propKeys = []) => {
  return computed(() => {
    const config = props.config || {};
    return propKeys.reduce((acc, key) => {
      if (typeof key !== "string") {
        const getKey = key[0];
        let setKey = key[0];
        let defaultValue;
        if (isNotEmpty(key[1])) {
          if (typeof key[1] === "string") {
            setKey = key[1];
          } else {
            setKey = getUsingConfig(key[1].key, key[0]);
            defaultValue = key[1].defaultValue;
          }
        }
        const propValue = getFieldValue(config, getKey);
        setFieldValue(acc, setKey, getUsingConfig(propValue, defaultValue));
      } else {
        const propValue = getFieldValue(config, key);
        setFieldValue(acc, key, propValue);
      }
      return acc;
    }, {}) || {};
  });
};

export { judgeUseFn, useElementFormEvent, useFormInput, useFormView, useInputProps, useOptions };
