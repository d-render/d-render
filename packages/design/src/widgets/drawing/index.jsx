import { h, watch, ref, provide, computed } from 'vue'
import VueDraggable from 'vuedraggable'
import { CipForm } from 'd-render'
import { isNotEmpty, useNamespace } from '@d-render/shared'
import { useFieldDrawing, useList } from './use-field-drawing'
import FormDrawingContent from './widgets/content'
import DeviceContainer from './widgets/device-container'

export default {
  props: {
    data: { type: Object, default: () => ({}) },
    equipment: { type: String },
    selectId: [Number, String],
    deviceType: {}
  },
  emits: ['updateList', 'select'],
  setup(props, context) {
    const ns = useNamespace('design-drawing')
    const { list, updateList } = useList({ props, emit: context.emit })
    const { selectItem, deleteItem, copyItem } = useFieldDrawing({
      list,
      updateList,
      emit: context.emit,
    })

    const addItem = ({ newIndex }) => {
      const newItem = list.value[newIndex]
      context.emit('select', newItem)
    }
    const updateConfig = (element, val) => {
      const cloneList = props.data?.list || []
      element.config = val
      updateList(cloneList, 'layoutUpdate')
    }
    // TODO: 此处需要处理layout删除时的数据
    const hoverList = ref([])
    const entryElement = (id) => {
      leaveElement(id)
      hoverList.value.push(id)
    }
    const leaveElement = (id) => {
      const idx = hoverList.value.indexOf(id)
      if (idx > -1) {
        hoverList.value.splice(hoverList.value.indexOf(id), 1)
      }
    }
    const currentHoverId = computed(() => {
      if (hoverList.value.length === 0) return undefined
      return hoverList.value[hoverList.value.length - 1]
    })
    provide('designDrawing', {
      entryElement,
      leaveElement,
      currentHoverId
    })

    // 表单内容包含 布局和input && table(特殊)
    const FormContent = (...args) => {
      const { element, index } = args[0]
      const formContentProps = {
        selectId: props.selectId,
        element,
        index,
        formLabelPosition: props.data.formLabelPosition,
        onUpdateConfig: (val) => {
          updateConfig(element, val)
        },
        onClick: () => { selectItem(element) },
        onDelete: () => { deleteItem(index); leaveElement(element.id) },
        onCopy: () => copyItem(index),
        onSelectItem: (element) => selectItem(element)
      }
      return h(FormDrawingContent, { ...formContentProps })
    }
    // 默认选中第一个
    watch(() => props.selectId, (val) => {
      if (!val && list.value.length > 0) {
        selectItem(list.value[0])
      }
    }, { immediate: true })
    // class={'cip-fd-form-drawing-container'}
    return () => (
      <div class={[ns.e('container')]}>
        {list.value.length === 0 && (
          <div class='empty-form--text'>从左侧拖拽来添加字段</div>
        )}
        <div class={[ns.b(), ns.m(props.equipment)]}>
          <DeviceContainer equipment={props.equipment} deviceType={props.deviceType}>
            <CipForm
              fieldList={[]}
              size={props.data.tableSize || 'default'}
              labelWidth={`${props.data.labelWidth}px`}
              labelPosition={props.data.labelPosition}
              labelSuffix={props.data.labelSuffix}
              equipment={props.equipment}
            >
              <VueDraggable
                modelValue={list.value}
                onUpdate:modelValue={(val) => updateList(val)}
                itemKey={'id'}
                group={'components'}
                handle={'.move-icon'}
                ghostClass={'ghost'}
                animation={200}
                componentData={{
                  class: ns.be('content', 'wrapper'),
                  style: isNotEmpty(props.data.grid)
                    ? `display: grid; grid-template-columns: repeat(${props.data.grid},1fr);align-content: start;`
                    : ''
                }}
                onAdd={({ newIndex }) => addItem({ newIndex })}
              >
                {{
                  item: FormContent
                }}
              </VueDraggable>
            </CipForm>
          </DeviceContainer>
        </div>
      </div>
    );
  },
};
