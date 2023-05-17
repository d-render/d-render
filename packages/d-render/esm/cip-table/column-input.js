import { computed, h } from 'vue';
import CipFormItem from '../cip-form-item';

var __defProp = Object.defineProperty;
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
var columnInput = {
  name: "ColumnInput",
  props: {
    config: Object,
    fieldKey: String,
    columnKey: String,
    index: Number,
    model: Object,
    tableDependOnValues: Object,
    propertyKey: [String, Number],
    tableRuleKey: String,
    tableData: Object,
    updateData: Function
  },
  setup(props) {
    const computedConfig = computed(() => {
      const config = __spreadValues({}, props.config);
      config.width = "100%";
      config.hideLabel = true;
      if (config.writable === true) {
        config.ruleKey = `${props.tableRuleKey}.${props.propertyKey}.${props.columnKey}`;
      }
      if (!config.writable) {
        config.readable = true;
        if (!config.dynamic) {
          config.dependOn = [];
        }
      }
      return config;
    });
    const fromItemProps = computed(() => {
      let {
        index,
        model,
        columnKey: fieldKey,
        tableDependOnValues,
        tableData,
        updateData
      } = props;
      return {
        model,
        // 数据
        fieldKey,
        // 整合tableData对象的键值
        tableDependOnValues,
        // table data依赖数据
        tableData,
        // table的数据
        config: computedConfig.value,
        // 改变后的配置
        inTable: true,
        // 特殊标记
        "onUpdate:model": (val) => {
          model = val;
          updateData(val, index);
        }
      };
    });
    return () => h(CipFormItem, fromItemProps.value);
  }
};

export { columnInput as default };
