import { h } from 'vue'
import VueDraggable from 'vuedraggable'
import { CipFormLayout } from 'd-render'
import { drawingContentProps } from '../common-props'
import { useFieldDrawingItem } from '../use-field-drawing-item'
import FormDrawingContent from '../content'
import { useNamespace } from '@d-render/shared'
export default {
  inheritAttrs: false,
  props: drawingContentProps,
  emits: ['delete', 'copy', 'selectItem', 'update:config'],
  setup (props, { emit }) {
    const { computedConfig, drawType, putStrategy } = useFieldDrawingItem({ props, emit })
    const ns = useNamespace('design-draw-content__layout')
    const updateConfig = (val) => {
      emit('update:config', val)
    }

    const selectItem = (element) => {
      emit('selectItem', element)
    }
    const judgePut = (...val) => {
      const dom = val?.[2] ?? {}
      const strategy = putStrategy[props.config.type]
      if (strategy) return strategy(dom)
      return true
    }
    const FormContent = ({ element, optionIndex, childIndex, updateOptionChild, copyOptionChild, deleteOptionChild }) => {
      const formContentProps = {
        selectId: props.selectId,
        element,
        optionIndex,
        onUpdateConfig: (val) => {
          updateOptionChild(optionIndex, childIndex, val)
        },
        onClick: (e) => {
          e.stopPropagation()
          selectItem(element)
        },
        onDelete: () => deleteOptionChild(optionIndex, childIndex),
        onCopy: () => copyOptionChild(optionIndex, childIndex), // 内部自由的copy
        onSelectItem: (val) => selectItem(val)
      }
      return h(FormDrawingContent, formContentProps)
    }
    return () => (
      <CipFormLayout
        fieldKey={props.fieldKey}
        config={computedConfig.value}
        drawType={drawType.value}
        isDesign={true}
        onUpdate:config={(val) => updateConfig(val)}
        onSelectItem={(element) => selectItem(element)}
      >
        {{
          item: ({ children, optionIndex, updateOptionChildren, addOptionChild, copyOptionChild, deleteOptionChild, updateOptionChild }) => (
            <VueDraggable
              modelValue={children}
              onUpdate:modelValue={(val) => { updateOptionChildren(optionIndex, val) }}
              itemKey={'id'}
              group={{ name: 'components', put: judgePut }}
              handle={'.move-icon'}
              ghostClass={'ghost'}
              animation={200}
              componentData={{ class: [ns.e('item'), { [ns.em('item', 'empty')]: children.length === 0 }], style: { } }}
              onAdd={(val) => addOptionChild(optionIndex, val)}
            >
              {{
                item: ({ element, index: childIndex, draggable }) => FormContent({
                  element,
                  optionIndex,
                  childIndex,
                  updateOptionChild,
                  copyOptionChild,
                  deleteOptionChild
                })
              }}
            </VueDraggable>
          )
        }}
      </CipFormLayout>
    )
  }
}
