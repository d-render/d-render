import { computed, h } from 'vue'
import VueDraggable from 'vuedraggable'
import { getNextItem, isEmptyObject, useFormInject } from '@d-render/shared'
import FormDrawingContent from '../content'
import TableContainer from './container'
import { drawingContentProps } from '../common-props'
import { getCopyRow } from '@/util'

export default {
  inheritAttrs: false,
  props: drawingContentProps,
  setup (props, { emit }) {
    const cipForm = useFormInject()
    const isMobile = computed(() => cipForm.equipment === 'mobile')
    const options = computed(() => {
      return props.config.options || []
    })
    const updateConfig = (val) => {
      emit('update:config', val)
    }
    // 修改options配置
    const updateOptions = (options) => {
      const config = props.config
      config.options = options.map(option => {
        const width = option.config.width !== undefined ? option.config.width : '200px'
        return {
          ...option,
          config: {
            ...option.config,
            width: width,
            writable: true
          }
        }
      }
      )
      updateConfig(config)
    }
    const addOption = ({ newIndex }) => {
      const newItem = options.value[newIndex]
      emit('selectItem', newItem)
    }
    const selectOption = (element) => {
      emit('selectItem', element)
    }
    const deleteOption = (index) => {
      const config = props.config
      const nextItem = getNextItem(config.options, index)
      if (!isEmptyObject(nextItem)) {
        selectOption(nextItem)
      } else {
        selectOption(props.config)
      }
      config.options.splice(index, 1)
      updateConfig(config)
    }
    const copyOption = (index) => {
      const config = props.config
      const newRow = getCopyRow(config.options[index])
      config.options.splice(index + 1, 0, newRow)
      updateConfig(config)
      selectOption(newRow)
    }
    const judgePut = (...val) => {
      const dom = val?.[2] ?? {}
      return !dom.classList.contains('disabled-table')
    }
    // 表单内容包含 布局和input && table(特殊)
    const FormContent = (...args) => {
      const { element, index } = args[0]
      const formContentProps = {
        selectId: props.selectId,
        element,
        index,
        formLabelPosition: props.formLabelPosition,
        // formLabelPosition: props.data.formLabelPosition,
        onUpdateConfig: (val) => {
          updateConfig(element, val)
        },
        onClick: (e) => {
          e.stopPropagation()
          selectOption(element)
        },
        onDelete: () => deleteOption(index),
        onCopy: () => copyOption(index),
        onSelectItem: (element) => selectOption(element)
      }
      return h(FormDrawingContent, { ...formContentProps })
    }
    return () => (
      <div class={'form-drawing__table__main'}>
        <TableContainer config={props.config}>
          <VueDraggable
            modelValue={options.value}
            onUpdate:modelValue={(val) => updateOptions(val)}
            group={{ name: 'components', put: judgePut }}
            handle={'.move-icon'}
            ghostClass={'ghost'}
            animation={200}
            itemKey={'id'}
            componentData={{
              class: 'form-table-columns',
              style: {
                display: isMobile.value ? 'block' : 'flex'
              }
            }}
            onAdd={(val) => addOption(val)}
          >
            {{
              item: FormContent
            }}
          </VueDraggable>
        </TableContainer>
      </div>
    )
  }
}
