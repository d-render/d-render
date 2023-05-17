import { defineComponent, ref, computed, h, createVNode } from 'vue';
import { ElForm, ElFormItem } from 'element-plus';
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue';
import { CipButton } from '@xdp/button';
import { useFormProvide, useCipConfig, useCipPageConfig, useObserveDomResize, getUsingConfig, debounce, isNumber } from '@d-render/shared';
import CipFormItem from '../cip-form-item';
import { useExpand } from './use-expand';
import { cipSearchFormProps } from './props';

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
var index = /* @__PURE__ */ defineComponent({
  name: "CipSearchForm",
  props: cipSearchFormProps,
  emits: ["update:model", "search"],
  setup(props, {
    emit,
    attrs
  }) {
    useFormProvide(props);
    const cipConfig = useCipConfig();
    const cipPageConfig = useCipPageConfig();
    const cipSearchForm = ref();
    const contentWidth = ref(1e3);
    useObserveDomResize(() => cipSearchForm.value.$el, (e) => {
      contentWidth.value = e.contentRect.width;
    });
    const _labelPosition = computed(() => {
      var _a, _b;
      return getUsingConfig(props.labelPosition, (_a = cipPageConfig.searchForm) == null ? void 0 : _a.labelPosition, (_b = cipConfig.searchForm) == null ? void 0 : _b.labelPosition);
    });
    const updateModel = (val) => {
      emit("update:model", val);
    };
    const emitSearch = debounce((type) => {
      emit("search", type);
    }, 200, false);
    const resetSearch = () => {
      updateModel({});
      emitSearch("reset");
    };
    const gridCount = computed(() => {
      const grid = getUsingConfig(props.grid, cipConfig.searchGrid);
      if (isNumber(grid) && grid > 0)
        return grid;
      const cellWidth = _labelPosition.value === "top" ? 268 : 335;
      return Math.max(2, Math.floor(contentWidth.value / cellWidth));
    });
    const {
      isExpand,
      toggleExpand,
      haveExpand,
      showFieldList,
      lastRowSpan,
      spanSum
    } = useExpand(props, gridCount);
    const isImmediateSearch = (config) => {
      return config.immediateSearch === true || config.autoSelect === true;
    };
    const showResetButton = computed(() => {
      return getUsingConfig(props.searchReset, cipConfig.searchReset);
    });
    const arrowIcon = computed(() => {
      return isExpand.value ? ArrowUp : ArrowDown;
    });
    const formModel = computed(() => Object.assign({}, props.defaultModel, props.model));
    const formItem = ({
      key,
      config
    } = {}) => {
      return h(CipFormItem, {
        key,
        model: formModel.value,
        fieldKey: key,
        config,
        grid: true,
        labelPosition: _labelPosition.value,
        onKeyup: (e) => {
          const {
            keyCode
          } = e;
          if (keyCode === 13) {
            emitSearch();
          }
        },
        onSearch: () => {
          emitSearch();
        },
        "onUpdate:model": (val) => {
          updateModel(val);
          if (isImmediateSearch(config))
            emitSearch();
        }
      });
    };
    const formItemList = () => showFieldList.value.map(formItem);
    const formDefaultSlots = () => {
      const slots = formItemList() || [];
      if (!props.hideSearch) {
        const isOne = showFieldList.value.length === 1;
        const buttonList = createVNode(ElFormItem, {
          "labelWidth": "0px",
          "class": ["cip-search-button", {
            "cip-search-button--right": !isOne,
            "cip-search-button--absolute": props.handleAbsolute && (isExpand.value && lastRowSpan.value === 0 || !isExpand.value && (haveExpand.value || spanSum.value === gridCount.value) && props.completeRow)
            // (spanSum.value % gridCount.value === 0)
          }],
          "style": {
            alignItems: _labelPosition.value === "top" ? "flex-end" : "flex-start",
            gridColumn: !isOne ? `${gridCount.value} / span 1` : void 0
          }
        }, {
          default: () => [createVNode(CipButton, {
            "buttonType": "search",
            "onClick": () => emitSearch()
          }, {
            default: ({
              text
            }) => {
              var _a;
              return (_a = props.searchButtonText) != null ? _a : text;
            }
          }), showResetButton.value && createVNode(CipButton, {
            "buttonType": "reset",
            "onClick": () => resetSearch()
          }, null), haveExpand.value && createVNode(CipButton, {
            "square": true,
            "icon": arrowIcon.value,
            "onClick": () => toggleExpand()
          }, null)]
        });
        slots.push(buttonList);
      }
      return slots;
    };
    return () => h(ElForm, __spreadProps(__spreadValues({}, attrs), {
      ref: cipSearchForm,
      class: "cip-search-form",
      // labelPosition: _labelPosition.value,
      size: "default",
      style: {
        gridTemplateColumns: `repeat(${gridCount.value}, 1fr)`
      },
      onSubmit: (e) => {
        e.preventDefault();
        emitSearch();
      }
      // 防止只有一个搜索项时按会车直接提交form的默认行为
    }), {
      default: formDefaultSlots
    });
  }
});

export { index as default };
