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
const configureOptionsFieldConfigMap = {
  key: {
    type: "input",
    label: "\u5B57\u6BB5\u6807\u8BC6",
    limit: 50,
    description: "\u4FEE\u6539\u672C\u9879\u5C06\u5BFC\u81F4\u6570\u636E\u4F9D\u8D56\u5931\u6548\uFF0C\u9700\u8981\u91CD\u65B0\u8FDB\u884C\u914D\u7F6E"
  },
  otherKey: {
    type: "input",
    label: "\u5176\u4ED6\u5B57\u6BB5\u6807\u8BC6",
    limit: 50,
    description: "\u4FEE\u6539\u672C\u9879\u5C06\u5BFC\u81F4\u6570\u636E\u4F9D\u8D56\u5931\u6548\uFF0C\u9700\u8981\u91CD\u65B0\u8FDB\u884C\u914D\u7F6E"
  },
  label: {
    type: "input",
    label: "\u6807\u9898",
    limit: 20
  },
  span: {
    type: "number",
    label: "\u5360\u5217\u6570",
    min: 1,
    max: 24
  },
  labelPosition: {
    type: "radio",
    label: "\u6807\u7B7E\u5BF9\u9F50\u65B9\u5F0F",
    options: [
      { label: "\u5DE6\u5BF9\u9F50", value: "left" },
      { label: "\u53F3\u5BF9\u9F50", value: "right" },
      { label: "\u9876\u90E8\u5BF9\u9F50", value: "top" }
    ],
    isButton: true,
    defaultValue: "right"
  },
  isMainField: {
    type: "switch",
    label: "\u662F\u5426\u4E3A\u4E3B\u8981\u5B57\u6BB5",
    description: "\u8BE5\u9879\u8BBE\u7F6E\u7528\u4E8E\u8868\u5355\u4F5C\u4E3A\u4E00\u4E2A\u7EC4\u4EF6\u88AB\u5F15\u5165\u65F6\u5217\u8868\u7684\u4E3B\u8981\u4FE1\u606F"
  },
  description: {
    type: "textarea",
    label: "\u5B57\u6BB5\u8BF4\u660E",
    limit: 200
  },
  hideLabel: {
    type: "switch",
    label: "\u662F\u5426\u9690\u85CF\u6807\u9898"
  },
  hideItem: {
    type: "switch",
    label: "\u662F\u5426\u9690\u85CF\u6B64\u9879"
  },
  width: {
    type: "input",
    label: "\u5BBD\u5EA6",
    defaultValue: "100%",
    limit: 10
  },
  labelWidth: {
    // 配置由插槽实现
    type: "number",
    label: "\u6807\u7B7E\u5BBD\u5EA6",
    step: 10
  },
  placeholder: {
    type: "input",
    label: "\u5360\u4F4D\u5185\u5BB9",
    limit: 200
  },
  defaultValue: {
    type: "input",
    label: "\u9ED8\u8BA4\u503C"
  },
  limit: {
    type: "number",
    label: "\u957F\u5EA6\u9650\u5236",
    min: 0
  },
  required: {
    label: "\u6821\u9A8C",
    type: "singleCheckbox",
    option: { value: true, label: "\u5FC5\u586B" }
  },
  requiredErrorMessage: {
    label: "",
    type: "input",
    placeholder: "\u81EA\u5B9A\u4E49\u9519\u8BEF\u63D0\u793A",
    dependOn: ["required"],
    readable: false,
    changeConfig: (config, { required }) => {
      if (required)
        config.writable = true;
      return config;
    },
    limit: 20
  },
  validateValue: {},
  validateValueErrorMessage: {
    label: "",
    type: "input",
    placeholder: "\u81EA\u5B9A\u4E49\u9519\u8BEF\u63D0\u793A",
    dependOn: ["validateValue"],
    readable: false,
    changeConfig: (config, { validateValue }) => {
      if (validateValue)
        config.writable = true;
      return config;
    },
    limit: 20
  },
  regexpValidate: {},
  regexpValidateErrorMessage: {
    label: "",
    type: "input",
    placeholder: "\u81EA\u5B9A\u4E49\u9519\u8BEF\u63D0\u793A",
    dependOn: ["regexpValidate"],
    readable: false,
    changeConfig: (config, { regexpValidate }) => {
      if (regexpValidate)
        config.writable = true;
      return config;
    },
    limit: 20
  },
  dependOn: {
    type: "input",
    label: "\u6570\u636E\u4F9D\u8D56",
    description: "\u4FEE\u6539\u5B57\u6BB5\u6807\u8BC6\u6216\u5176\u4ED6\u5B57\u6BB5\u6807\u8BC6\u5C06\u5BFC\u81F4\u672C\u9879\u914D\u7F6E\u5931\u6548\uFF0C\u9700\u8981\u91CD\u65B0\u8FDB\u884C\u914D\u7F6E"
  },
  changeValueType: {
    type: "radio",
    label: "\u4F9D\u8D56\u6570\u636E\u503C\u53D8\u52A8\u56DE\u8C03\u51FD\u6570-\u4FEE\u6539\u503C",
    description: "\u4FEE\u6539\u5B57\u6BB5\u6807\u8BC6\u6216\u5176\u4ED6\u5B57\u6BB5\u6807\u8BC6\u5C06\u5BFC\u81F4\u672C\u9879\u914D\u7F6E\u5931\u6548\uFF0C\u9700\u8981\u91CD\u65B0\u8FDB\u884C\u914D\u7F6E",
    defaultValue: "writing",
    options: [
      { value: "writing", label: "\u624B\u5199" },
      { value: "config", label: "\u914D\u7F6E" }
    ]
  },
  changeValueStr: {
    type: "input",
    label: "",
    dependOn: ["changeValueType"],
    changeConfig: (config, { changeValueType }) => {
      config.readable = changeValueType === "writing";
      return config;
    }
  },
  valueChangeConfig: {
    dependOn: ["changeValueType"],
    changeConfig: (config, { changeValueType }) => {
      config.readable = changeValueType === "config";
      return config;
    }
  },
  changeConfigType: {
    type: "radio",
    label: "\u4F9D\u8D56\u6570\u636E\u503C\u53D8\u52A8\u56DE\u8C03\u51FD\u6570-\u4FEE\u6539\u8868\u5355\u914D\u7F6E",
    description: "\u4FEE\u6539\u5B57\u6BB5\u6807\u8BC6\u6216\u5176\u4ED6\u5B57\u6BB5\u6807\u8BC6\u5C06\u5BFC\u81F4\u672C\u9879\u914D\u7F6E\u5931\u6548\uFF0C\u9700\u8981\u91CD\u65B0\u8FDB\u884C\u914D\u7F6E",
    defaultValue: "writing",
    options: [
      { value: "writing", label: "\u624B\u5199" },
      { value: "config", label: "\u914D\u7F6E" }
    ]
  },
  changeConfigStr: {
    type: "input",
    label: "",
    dependOn: ["changeConfigType"],
    changeConfig: (config, { changeConfigType }) => {
      config.readable = changeConfigType === "writing";
      return config;
    }
  },
  configChangeConfig: {
    dependOn: ["changeConfigType"],
    changeConfig: (config, { changeConfigType }) => {
      config.readable = changeConfigType === "config";
      return config;
    }
  }
};
const basicInputConfigureOptions = () => {
  return {
    key: {},
    label: {},
    // labelPosition: {}, //暂不开启组件自定义label对其方式
    description: {},
    hideLabel: {},
    hideItem: {},
    width: {},
    labelWidth: {},
    dependOn: {},
    changeValueType: {},
    changeValueStr: {},
    valueChangeConfig: {},
    changeConfigType: {},
    changeConfigStr: {},
    configChangeConfig: {}
  };
};
const basicTwoInputConfigureOptions = () => {
  return {
    key: {},
    otherKey: {},
    label: {},
    description: {},
    isMainField: {},
    hideLabel: {},
    hideItem: {},
    width: {},
    labelWidth: {},
    dependOn: {},
    changeValueType: {},
    changeValueStr: {},
    valueChangeConfig: {},
    changeConfigType: {},
    changeConfigStr: {},
    configChangeConfig: {}
  };
};
const defaultConfigureOptions = () => __spreadProps(__spreadValues({}, basicInputConfigureOptions()), {
  required: {},
  requiredErrorMessage: {},
  validateValue: {},
  validateValueErrorMessage: {},
  regexpValidate: {},
  regexpValidateErrorMessage: {}
});

export { basicInputConfigureOptions, basicTwoInputConfigureOptions, configureOptionsFieldConfigMap, defaultConfigureOptions };
