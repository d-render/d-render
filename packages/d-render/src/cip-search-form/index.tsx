import { h, defineComponent, computed, ref } from 'vue'
import type { Ref } from 'vue'
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
  useCipPageConfig, getFieldValue
} from '@d-render/shared'
import type { IAnyObject, IRenderConfig, IFormConfig } from '@d-render/shared'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useComponentProps } from '@xdp/config'
import CipFormItem from '../cip-form-item'
import { useExpand } from './use-expand'
import { cipSearchFormProps } from './props'
// cip-search-form 强制开启grid模式
export default defineComponent({
  name: 'CipSearchForm',
  props: cipSearchFormProps,
  emits: ['update:model', 'search'],
  setup (props, { emit, attrs }) {
    useFormProvide(props)
    const cipConfig = useCipConfig()
    const cipPageConfig = useCipPageConfig()
    const cipSearchForm: Ref<InstanceType<typeof ElForm>|null> = ref(null)
    const contentWidth = ref(1000)

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
      return getUsingConfig(
        props.grid,
        getFieldValue(cipPageConfig, 'searchForm.grid'),
        getFieldValue(cipConfig, 'searchForm.grid'),
        getFieldValue(cipConfig, 'searchGrid')
      ) as number
    })
    const searchResetBridge = computed(() => {
      return getUsingConfig(
        props.searchReset,
        getFieldValue(cipPageConfig, 'searchForm.searchReset'),
        getFieldValue(cipConfig, 'searchForm.searchReset'),
        getFieldValue(cipConfig, 'searchReset')
      )
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
    const emitSearch = debounce((type?: string) => { emit('search', type) }, 200, false) as (type?: string)=> void

    const resetSearch = () => {
      // 重置的时候载入默认model
      updateModel({ })
      emitSearch('reset')
    }

    // 1366使用3列，1920使用5列，默认4列
    const gridCount = computed(() => { // 单列值
      const grid = gridBridge.value // = getUsingConfig(props.grid, cipConfig.searchGrid)
      if (isNumber(grid) && grid > 0) return grid // 过滤grid为数字且grid>0 则使用固定的列
      const cellWidth = searchFormProps.value.labelPosition === 'top' ? 268 : 335
      return Math.max(2, Math.floor(contentWidth.value / cellWidth)) // contentWidth.value < 1300 ? 3 : (contentWidth.value > 1900 ? 5 : 4)
    })

    const {
      isExpand,
      toggleExpand,
      haveExpand,
      showFieldList,
      lastRowSpan,
      spanSum
    } = useExpand(props, gridCount, searchFormProps)

    const isImmediateSearch = (config: IRenderConfig) => {
      return config.immediateSearch === true || config.autoSelect === true
    }

    const showResetButton = computed(() => {
      return searchResetBridge.value // getUsingConfig(props.searchReset, cipConfig.searchReset)
    })

    const arrowIcon = computed(() => {
      return isExpand.value ? ArrowUp : ArrowDown
    })

    const formModel = computed(() => Object.assign({}, props.defaultModel, props.model))

    const formItem = ({ key, config }: IFormConfig = { key: '', config: {} }) => {
      return h(CipFormItem, {
        key,
        model: formModel.value,
        fieldKey: key,
        config,
        grid: true,
        labelPosition: searchFormProps.value.labelPosition,
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
      const slots = formItemList() || []
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
            gridColumn: !isOne ? `${gridCount.value} / span 1` : undefined
          }}
        >
          <CipButton buttonType={'search'} onClick={() => emitSearch()}>
            {{ default: ({ text }: {text: string}) => props.searchButtonText ?? text }}
          </CipButton>
          {showResetButton.value && <CipButton buttonType={'reset'} onClick={() => resetSearch()}/>}
          {haveExpand.value && <CipButton square={true} icon={arrowIcon.value} onClick={() => toggleExpand()}/>}
        </ElFormItem>
        slots.push(buttonList)
      }
      return slots
    }

    return () => h(ElForm, {
      ...attrs,
      ref: cipSearchForm,
      class: 'cip-search-form',
      // labelPosition: _labelPosition.value,
      size: 'default',
      style: { gridTemplateColumns: `repeat(${gridCount.value}, 1fr)` },
      onSubmit: (e: Event) => {
        e.preventDefault()
        emitSearch()
      } // 防止只有一个搜索项时按会车直接提交form的默认行为
    }, { default: formDefaultSlots })
  }

})
