import { h, defineComponent, computed, ref, watch, Fragment, toRef } from 'vue'
import type { Ref, VNode, SlotsType, Component } from 'vue'
import { ElForm, ElFormItem } from 'element-plus'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
// @ts-ignore
import { CipButton } from '@xdp/button'
import {
  debounce,
  isNumber,
  getUsingConfig,
  useFormProvide,
  useObserveDomResize,
  useCipConfig,
  useCipPageConfig,
  getFieldValue,
  isEmpty
} from '@d-render/shared'
import type { IAnyObject, TSearchFormConfig, IFieldItem } from '@d-render/shared'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useComponentProps } from '@xdp/config'
import CipFormItem from '../cip-form-item'
import { useExpand } from './use-expand'
import { cipSearchFormProps } from './props'
export interface OperationSlotProps {
  emitSearch: (type?: string) => void
  resetSearch: () => void
  toggleExpand: () => void
  isExpand: boolean
  haveExpand: boolean
  showResetButton: boolean
  arrowIcon: Component
  searchButtonText: string | undefined
}
// cip-search-form 强制开启grid模式
// [2023-11-21] 新增一个怪异模式quirks
export default defineComponent({
  name: 'CipSearchForm',
  props: cipSearchFormProps,
  emits: ['update:model', 'search'],
  slots: Object as SlotsType<{
    operation: (props: OperationSlotProps) => VNode | VNode[] | null | undefined
  }>,
  setup (props, { emit, attrs, slots }) {
    const changeCount = ref(0) // model 整个对象变化的次数
    const formModel = ref(props.model)// toRef(props, 'model')
    watch(() => props.model, () => {
      // 调整逻辑
      formModel.value = props.model ?? {}
      changeCount.value++
    }, { immediate: true, flush: 'pre' })
    watch([() => props.defaultModel, changeCount], () => {
      if (props.defaultModel && formModel.value) {
        const dModel = props.defaultModel as IAnyObject
        Object.keys(dModel).forEach(key => {
          // 只有formModel.value对应的值为空才合并，如果props.model整体变化则再合并一次
          if (isEmpty(formModel.value![key]) && isEmpty(dModel[key])) {
            formModel.value![key] = dModel[key]
          }
        })
      }
    }, {
      immediate: true,
      deep: true,
      flush: 'post'
    })
    useFormProvide(props)
    const cipConfig = useCipConfig()
    const cipPageConfig = useCipPageConfig()
    const cipSearchForm: Ref<InstanceType<typeof ElForm> | null> = ref(null)
    const contentWidth = ref(1000)
    // tips:开启怪异模式后行为会变得奇怪
    const quirks = computed(() => {
      return cipConfig?.quirks
    })
    const searchFormPropsKey = [
      ['collapse', true],
      'labelPosition',
      // 'grid',
      'searchButtonText'
      // 'searchReset'
    ]

    const searchFormProps = useComponentProps(props, 'searchForm', searchFormPropsKey, [cipPageConfig])
    // 保留原始兼容性
    const gridBridge = computed(() => {
      const result = getUsingConfig(
        props.grid,
        getFieldValue(cipPageConfig, 'searchForm.grid'),
        getFieldValue(cipConfig, 'searchForm.grid'),
        getFieldValue(cipConfig, 'searchGrid') // 此值可能为true需要转为0
      ) as number | true | undefined
      if (result === true || result === undefined) return 0
      return result
    })
    const searchResetBridge = computed(() => {
      return getUsingConfig(
        props.searchReset,
        getFieldValue(cipPageConfig, 'searchForm.searchReset'),
        getFieldValue(cipConfig, 'searchForm.searchReset'),
        getFieldValue(cipConfig, 'searchReset')
      ) as boolean
    })
    const needWatchDom = computed(() => {
      return searchFormProps.value.collapse && (isNumber(gridBridge.value) && gridBridge.value <= 0)
    })

    if (needWatchDom.value) {
      useObserveDomResize(() => cipSearchForm.value!.$el, (e) => {
        contentWidth.value = e.contentRect.width
      })
    }

    // 值更新
    const updateModel = (val: IAnyObject) => {
      // FIX[2023-05-22]: 修复model更新且未更新defaultModel的值，model对象写入defaultModel的数据导致defaultModel失效

      const dModel = props.defaultModel || {}
      Object.keys(dModel).forEach(key => {
        if (val[key] === dModel[key]) {
          Reflect.deleteProperty(val, key)
        }
      })

      emit('update:model', val)
    }
    // 触发搜索
    const emitSearch = debounce((type?: string) => {
      cipSearchForm.value?.validate((valid) => {
        if (valid) {
          emit('search', type)
        }
      })
    }, 200, false) as (type?: string) => void

    const resetSearch = () => {
      // 重置的时候载入默认model
      updateModel({})
      emitSearch('reset')
    }

    // 1366使用3列，1920使用5列，默认4列
    const gridCount = computed(() => { // 单列值
      const grid = gridBridge.value // = getUsingConfig(props.grid, cipConfig.searchGrid)
      if (isNumber(grid) && grid > 0) return grid // 过滤grid为数字且grid>0 则使用固定的列
      const cellWidth = searchFormProps.value.labelPosition === 'top' ? 268 : 335
      let count = Math.max(2, Math.floor(contentWidth.value / cellWidth))
      if (quirks.value) {
        if (count === 5) count = 4
        if (count > 6) count = 6
      }
      return count // contentWidth.value < 1300 ? 3 : (contentWidth.value > 1900 ? 5 : 4)
    })

    const operationSpan = computed(() => Math.max(1, Math.floor(props.operationSpan ?? 1)))

    const {
      isExpand,
      toggleExpand,
      haveExpand,
      showFieldList,
      lastRowSpan,
      spanSum
    } = useExpand(props, gridCount, searchFormProps, operationSpan)

    const isImmediateSearch = (config: TSearchFormConfig) => {
      return config.immediateSearch === true || config.autoSelect === true
    }

    const showResetButton = computed(() => {
      return searchResetBridge.value // getUsingConfig(props.searchReset, cipConfig.searchReset)
    })

    const arrowIcon = computed(() => {
      return isExpand.value ? ArrowUp : ArrowDown
    })

    // refactor: 此处代码以修复存在defaultModel后resetValue无效的问题
    // const formModel = computed(() => {
    //   if (!props.defaultModel) {
    //     console.log('defaultModel不存在')
    //     return props.model
    //   }
    //   // 上次只处理了不存在defaultModel的情况，现在需要处理有defaultModel的情况了
    //   return Object.assign({}, props.defaultModel, props.model)
    // })
    const formItem = ({ key, config }: IFieldItem<TSearchFormConfig> = { key: '', config: {} }) => {
      return h(CipFormItem, {
        key,
        model: formModel.value,
        fieldKey: key,
        config,
        changeCount: changeCount.value, // 对象变化次数
        grid: gridCount.value,
        labelPosition: searchFormProps.value.labelPosition,
        parentDependOnValues: props.dependOnValues,
        inParent: props.inForm,
        onKeyup: (e: KeyboardEvent) => {
          const { keyCode } = e
          if (keyCode === 13) {
            emitSearch()
          }
        },
        onSearch: () => {
          emitSearch()
        },
        'onUpdate:model': (val) => {
          updateModel(val)
          // 值变更时立即搜索
          if (isImmediateSearch(config)) emitSearch()
        }

      })
    }

    const formItemList = () => showFieldList.value!.map(formItem)
    const formDefaultSlots = () => {
      const fieldSlots = formItemList() || []
      // 隐藏搜索按钮 或
      // 当搜索条件整行时 且 为展开时
      if (!props.hideSearch) {
        // 是否仅一个搜索条件
        const isOne = showFieldList.value!.length === 1
        const buttonList = <ElFormItem
          labelWidth={'0px'}
          class={
            [
              'cip-search-button',
              {
                'cip-search-button--right': !isOne,
                'cip-search-button--absolute': props.handleAbsolute && ((isExpand.value && lastRowSpan.value === 0) || (!isExpand.value && (haveExpand.value || spanSum.value === gridCount.value) && props.completeRow)) // (spanSum.value % gridCount.value === 0)
              }
            ]
          }
          style={{
            alignItems: searchFormProps.value.labelPosition === 'top' ? 'flex-end' : 'flex-start',
            gridColumn: !isOne ? `${gridCount.value - operationSpan.value + 1} / span ${operationSpan.value}` : undefined
          }}
        >
          {slots.operation
            ? slots.operation({
              emitSearch,
              resetSearch,
              toggleExpand,
              isExpand: isExpand.value,
              haveExpand: haveExpand.value,
              showResetButton: showResetButton.value,
              arrowIcon: arrowIcon.value,
              searchButtonText: props.searchButtonText
            })
            : <Fragment>
                <CipButton buttonType={'search'} onClick={() => emitSearch()}>
                  {{ default: ({ text }: { text: string }) => props.searchButtonText ?? text }}
                </CipButton>
                {showResetButton.value && <CipButton buttonType={'reset'} onClick={() => resetSearch()} />}
                {haveExpand.value && <CipButton square={true} icon={arrowIcon.value} onClick={() => toggleExpand()} />}
              </Fragment>
          }
        </ElFormItem>
        fieldSlots.push(buttonList)
      }
      return fieldSlots
    }

    return () => h(ElForm, {
      ...attrs,
      ref: cipSearchForm,
      class: 'cip-search-form',
      // labelPosition: _labelPosition.value,
      size: 'default',
      style: { gridTemplateColumns: `repeat(${gridCount.value}, 1fr)` },
      model: formModel.value,
      onSubmit: (e: Event) => {
        e.preventDefault()
        emitSearch()
      } // 防止只有一个搜索项时按会车直接提交form的默认行为
    }, { default: formDefaultSlots })
  }

})
