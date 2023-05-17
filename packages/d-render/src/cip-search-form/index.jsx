import { h, defineComponent, computed, ref } from 'vue'
import { ElForm, ElFormItem } from 'element-plus'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { CipButton } from '@xdp/button'
import {
  debounce,
  isNumber,
  getUsingConfig,
  useFormProvide,
  useObserveDomResize,
  useCipConfig,
  useCipPageConfig
} from '@d-render/shared'
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
    const cipSearchForm = ref()
    const contentWidth = ref(1000)
    useObserveDomResize(() => cipSearchForm.value.$el, (e) => {
      contentWidth.value = e.contentRect.width
    })
    const _labelPosition = computed(() => getUsingConfig(
      props.labelPosition,
      cipPageConfig.searchForm?.labelPosition,
      cipConfig.searchForm?.labelPosition
    ))
    // 值更新
    const updateModel = (val) => { emit('update:model', val) }
    // 触发搜索
    const emitSearch = debounce((type) => { emit('search', type) }, 200, false)

    const resetSearch = () => {
      // 重置的时候载入默认model
      updateModel({ })
      emitSearch('reset')
    }

    // 1366使用3列，1920使用5列，默认4列
    const gridCount = computed(() => { // 单列值
      const grid = getUsingConfig(props.grid, cipConfig.searchGrid)
      if (isNumber(grid) && grid > 0) return grid // 过滤grid为数字且grid>0 则使用固定的列
      const cellWidth = _labelPosition.value === 'top' ? 268 : 335
      return Math.max(2, Math.floor(contentWidth.value / cellWidth)) // contentWidth.value < 1300 ? 3 : (contentWidth.value > 1900 ? 5 : 4)
    })

    const {
      isExpand,
      toggleExpand,
      haveExpand,
      showFieldList,
      lastRowSpan,
      spanSum
    } = useExpand(props, gridCount)

    const isImmediateSearch = (config) => {
      return config.immediateSearch === true || config.autoSelect === true
    }

    const showResetButton = computed(() => {
      return getUsingConfig(props.searchReset, cipConfig.searchReset)
    })

    const arrowIcon = computed(() => {
      return isExpand.value ? ArrowUp : ArrowDown
    })

    const formModel = computed(() => Object.assign({}, props.defaultModel, props.model))

    const formItem = ({ key, config } = {}) => {
      return h(CipFormItem, {
        key,
        model: formModel.value,
        fieldKey: key,
        config: config,
        grid: true,
        labelPosition: _labelPosition.value,
        onKeyup: (e) => {
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

    const formItemList = () => showFieldList.value.map(formItem)
    const formDefaultSlots = () => {
      const slots = formItemList() || []
      // 隐藏搜索按钮 或
      // 当搜索条件整行时 且 为展开时
      if (!props.hideSearch) {
        // 是否仅一个搜索条件
        const isOne = showFieldList.value.length === 1
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
            alignItems: _labelPosition.value === 'top' ? 'flex-end' : 'flex-start',
            gridColumn: !isOne ? `${gridCount.value} / span 1` : undefined
          }}
        >
          <CipButton buttonType={'search'} onClick={() => emitSearch()}>
            {{ default: ({ text }) => props.searchButtonText ?? text }}
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
      onSubmit: (e) => {
        e.preventDefault()
        emitSearch()
      } // 防止只有一个搜索项时按会车直接提交form的默认行为
    }, { default: formDefaultSlots })
  }

})
