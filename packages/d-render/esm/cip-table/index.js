import { defineComponent, ref, computed, reactive, provide, createVNode, mergeProps, h, createTextVNode } from 'vue';
import { ElTable, ElTableColumn, ElRadio, ElTooltip } from 'element-plus';
import TableSelectionColumn from './table-column-selection';
import { useCipConfig, useCipPageConfig, getUsingConfig, cipTableKey, isNotEmpty, isEmpty, isArray, setFieldValue } from '@d-render/shared';
import { CipButtonCollapse } from '@xdp/button';
import { tableProps } from './table-props';
import ColumnInput from './column-input';
import { EmptyStatus } from './icons-vue';
import { handleColumnWidthMap, dateColumnWidthMap } from './config';
import { calculateCurrentWidth, analyseData, getPropertyKeyByPath } from './util';

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
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var index = /* @__PURE__ */ defineComponent({
  name: "CipTable",
  inheritAttrs: false,
  props: tableProps,
  emits: ["sort", "update:data", "update:selectColumns"],
  setup(props, context) {
    const cipConfig = useCipConfig();
    const cipPageConfig = useCipPageConfig();
    const cipTableRef = ref();
    const _size = computed(() => {
      return getUsingConfig(props.size, cipConfig.table.size, "default");
    });
    const _broder = computed(() => {
      var _a;
      return getUsingConfig(props.border, (_a = cipPageConfig.table) == null ? void 0 : _a.border, cipConfig.table.border);
    });
    const calculateCurrentWidthFn = computed(() => {
      if (props.size)
        return (width) => width;
      const {
        sizeStandard = "default",
        size = "default"
      } = cipConfig.table || {};
      return (width) => calculateCurrentWidth(size, sizeStandard, width);
    });
    const cipTable = reactive({
      size: _size
    });
    provide(cipTableKey, cipTable);
    context.expose({
      cipTableRef
    });
    const updateData = (val, index) => {
      const dataIndexed = analyseData(props.data, props.treeProps);
      const path = dataIndexed[index];
      const propertyKey = getPropertyKeyByPath(path, props.treeProps);
      const data = props.data;
      setFieldValue(data, propertyKey, val);
      context.emit("update:data", data);
    };
    const onSortChange = ({
      prop,
      order
    }) => {
      context.emit("sort", {
        prop,
        order
      });
    };
    const onSelectionChange = (val) => {
      context.emit("update:selectColumns", val);
    };
    const transformWidth = (widthStr) => {
      if (typeof widthStr === "number")
        return Math.ceil(calculateCurrentWidthFn.value(widthStr));
      if (widthStr.indexOf("px") > -1)
        return `${Math.ceil(calculateCurrentWidthFn.value(Number(widthStr.replace(/px$/, ""))))}px`;
      return widthStr;
    };
    const renderTableColumn = ({
      key,
      config
    } = {}) => {
      const _a = config, {
        children,
        type,
        formatter,
        columnType
      } = _a, tableColumnConfig = __objRest(_a, [
        "children",
        "type",
        "formatter",
        "columnType"
      ]);
      if (!tableColumnConfig.width) {
        if (config.type === "date" && config.viewType === "datetime") {
          tableColumnConfig.width = dateColumnWidthMap[_size.value];
        }
      } else {
        tableColumnConfig.width = transformWidth(tableColumnConfig.width);
      }
      const headerSlots = ({
        column,
        $index
      }) => {
        var _a2;
        if ((_a2 = config.slots) == null ? void 0 : _a2.header) {
          return config.slots.header({
            column,
            $index,
            config,
            key
          });
        }
        const result = [h("span", {}, [config.label])];
        if (config.description) {
          const descriptionComp = createVNode(ElTooltip, {
            "effect": config.descriptionEffect || "light",
            "placement": "top"
          }, {
            content: () => config.description,
            default: () => createVNode("i", {
              "class": "el-icon-question",
              "style": "margin-left:2px"
            }, null)
          });
          result.push(descriptionComp);
        }
        if (config.required === true && config.writable === true) {
          const requiredAsterisk = createVNode("span", {
            "class": ["cip-danger-color"],
            "style": {
              marginRight: "4px"
            }
          }, [createTextVNode("*")]);
          result.unshift(requiredAsterisk);
        }
        return result;
      };
      let dataIndexed;
      if (props.rowKey) {
        dataIndexed = analyseData(props.data, props.treeProps);
      }
      if (columnType === "checkbox") {
        return createVNode(TableSelectionColumn, mergeProps(tableColumnConfig, {
          "prop": key,
          "data": props.data,
          "label": config.label
        }), null);
      }
      return h(ElTableColumn, __spreadValues({
        prop: key,
        align: config.type === "number" ? "right" : "",
        // 针对数字类型进行居右优化
        style: "display: flex;"
      }, tableColumnConfig), {
        header: headerSlots,
        default: ({
          row,
          $index,
          column
        }) => {
          if (isArray(config.children) && config.children.length > 0) {
            return renderTableColumns(config.children);
          } else {
            if ($index < 0)
              return null;
            if (!["default", "append", "prepend", "expand", "_handler", "$handler"].includes(key) && context.slots[key]) {
              return context.slots[key]({
                row,
                $index,
                column
              });
            }
            if (context.slots[`${key}Slot`]) {
              return context.slots[`${key}Slot`]({
                row,
                $index,
                column
              });
            }
            let propertyKey = $index;
            if (dataIndexed) {
              const path = dataIndexed[$index];
              if (path) {
                propertyKey = (path == null ? void 0 : path.length) > 1 ? getPropertyKeyByPath(path, props.treeProps) : path[0];
              }
            }
            return h(ColumnInput, {
              config,
              fieldKey: props.fieldKey,
              index: $index,
              model: row,
              key,
              tableRuleKey: props.ruleKey,
              propertyKey,
              columnKey: key,
              tableDependOnValues: props.dependOnValues,
              tableData: props.data,
              updateData
            });
          }
        }
      });
    };
    const renderTableColumns = (columns = []) => {
      if (!isArray(columns)) {
        throw new Error("function renderTableColumns param columns must be array");
      }
      return columns.filter((column) => !column.config.hideItem).map((column) => renderTableColumn(column));
    };
    const TableColumns = () => {
      const slots = renderTableColumns(props.columns);
      if (isNotEmpty(props.offset) && props.offset > -1 && !props.hideIndex) {
        const indexColumn = h(ElTableColumn, {
          label: "\u5E8F\u53F7",
          fixed: props.indexFixed ? "left" : "",
          width: transformWidth(isEmpty(props.rowKey) ? 55 : 75)
        }, {
          default: ({
            $index
          }) => `${$index + 1 + props.offset}`
        });
        slots.unshift(indexColumn);
      }
      if (props.selectType === "checkbox") {
        const option = {
          type: "selection",
          width: transformWidth(45),
          fixed: "left"
        };
        if (isNotEmpty(props.selectable)) {
          option.selectable = (row, index) => props.selectable(row || {}, index);
        }
        const selectionColumn = h(ElTableColumn, option);
        slots.unshift(selectionColumn);
      }
      if (props.selectType === "radio") {
        const selectionColumn = h(ElTableColumn, {
          width: transformWidth(45),
          fixed: "left"
        }, {
          default: ({
            row
          }) => {
            var _a;
            return h(ElRadio, {
              label: (_a = row[props.selectLabel]) != null ? _a : row.id,
              modelValue: props.selectRadio,
              disabled: props.selectable && !props.selectable(row)
            }, {
              default: () => ""
            });
          }
        });
        slots.unshift(selectionColumn);
      }
      if (context.slots.expand) {
        const expendColumn = h(ElTableColumn, {
          type: "expand",
          width: transformWidth(32),
          fixed: "left"
        }, {
          default: ({
            row,
            index
          }) => context.slots.expand({
            row,
            index
          })
        });
        slots.unshift(expendColumn);
      }
      if (props.withTableHandle && (context.slots._handler || context.slots.$handler)) {
        const handlerSlot = context.slots._handler || context.slots.$handler;
        const handlerColumn = h(ElTableColumn, {
          label: "\u64CD\u4F5C",
          fixed: "right",
          width: props.handlerWidth ? transformWidth(props.handlerWidth) : handleColumnWidthMap[_size.value]
        }, {
          default: ({
            row,
            $index
          }) => h(CipButtonCollapse, {
            limit: props.handlerLimit,
            row
          }, {
            default: () => handlerSlot({
              row,
              $index
            })
          })
        });
        slots.push(handlerColumn);
      }
      if (context.slots.default) {
        slots.push(context.slots.default());
      }
      if (context.slots.prepend) {
        const prependSlots = context.slots.prepend();
        if (isArray(prependSlots)) {
          slots.unshift(...prependSlots);
        } else {
          slots.unshift(prependSlots);
        }
      }
      if (context.slots.append) {
        const appendSlots = context.slots.append();
        if (isArray(appendSlots)) {
          slots.push(...appendSlots);
        } else {
          slots.push(appendSlots);
        }
      }
      if (props.tableHeaderLabel)
        return h(ElTableColumn, {
          label: props.tableHeaderLabel,
          align: "center"
        }, {
          default: () => slots
        });
      return slots;
    };
    const EmptyBlock = () => {
      return createVNode("div", {
        "class": "cip-table__empty"
      }, [createVNode(EmptyStatus, {
        "class": "cip-table__empty__svg"
      }, null), createVNode("div", {
        "class": "cip-table__empty__text"
      }, [createTextVNode("\u6682\u65E0\u6570\u636E")])]);
    };
    return () => createVNode(ElTable, mergeProps({
      "ref": cipTableRef,
      "size": _size.value
    }, context.attrs, {
      "class": "cip-table",
      "border": _broder.value,
      "data": props.data,
      "height": props.height,
      "rowKey": props.rowKey,
      "treeProps": props.treeProps,
      "defaultExpendAll": props.defaultExpendAll,
      "onSortChange": onSortChange,
      "onSelectionChange": onSelectionChange
    }), {
      default: () => createVNode(TableColumns, null, null),
      empty: () => createVNode(EmptyBlock, null, null)
    });
  }
});

export { index as default };
