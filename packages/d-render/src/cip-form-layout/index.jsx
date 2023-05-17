import { h, toRefs, computed } from 'vue'
import { getH5LayoutComponent, getLayoutComponent, getLayoutViewComponent } from './util'
import { useFormInject } from '@d-render/shared'
export default {
  name: 'CipFormLayout',
  props: {
    config: Object, // 字段配置信息
    fieldKey: String, // 字段名
    model: { // 字段所属model
      type: Object,
      default: () => ({})
    },
    grid: {}, // Number | Boolean
    componentKey: {},
    readonly: Boolean // 是否只读-即查看模式
  },
  emits: ['update:model', 'validate', 'submit', 'cancel', 'selectItem', 'update:config'],
  setup (props, context) {
    const { model } = toRefs(props)
    const cipForm = useFormInject()
    const cipFormStyle = computed(() => {
      if (props.grid) {
        return { gridColumn: `span ${props.config.span}` }
      } else {
        return 'width: 100%'
      }
    })

    const formLayout = () => {
      const componentProps = {
        class: ['cip-form-layout', { 'cip-form-layout--hidden': props.config.hideItem }],
        model: model.value,
        config: props.config,
        fieldKey: props.fieldKey,
        style: cipFormStyle.value
      }
      const componentType = props.config.type
      if (props.readonly) {
        return h(getLayoutViewComponent(componentType), componentProps, {
          item: ({ children, index }) => {
            return context.slots.item?.({ children, index })
          }
        })
      } else {
        const method = cipForm.equipment === 'pc' ? getLayoutComponent : getH5LayoutComponent
        return h(method(componentType),
          {
            ...componentProps,
            'onUpdate:config': (val) => { context.emit('update:config', val) },
            onValidate: (fn) => { context.emit('validate', fn) },
            onSubmit: () => { context.emit('submit') },
            onCancel: () => { context.emit('cancel') },
            onSelectItem: (val) => { context.emit('selectItem', val) }
          }
          , {
            item: (scope) => {
              return context.slots.item?.(scope)
            }
          }
        )
      }
    }
    return () => formLayout()
  }
}
