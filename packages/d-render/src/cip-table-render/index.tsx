// 此组件依赖于DRender的table组件
import { getH5InputComponent, getInputComponent } from '../utils'
import { computed, h, provide, defineComponent, PropType } from 'vue'
import { IAnyObject, ITableColumnConfig } from '@d-render/shared'
export default defineComponent({
  props: {
    schema: {
      type: Object as PropType<{
        tableColumnStatus: string,
        list: Array<ITableColumnConfig>}>,
      required: true
    },
    model: {},
    equipment: { type: String, default: 'pc' },
    service: Object
  },
  setup (props) {
    const config = computed(() => {
      return Object.keys(props.schema).reduce((acc: IAnyObject, key) => {
        if (key !== 'list') {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          acc[key] = props.schema[key]
        }
        return acc
      }, {})
    })
    const Component = () => {
      const tableProps = {
        modelValue: props.model,
        config: {
          ...config.value,
          options: props.equipment === 'pc'
            ? [{
                key: 'default',
                children: props.schema.list
              }]
            : props.schema.list
        }
      }
      if (props.equipment === 'pc') {
        return h(getInputComponent('table'), tableProps)
      } else {
        return h(getH5InputComponent('table'), tableProps)
      }
    }
    provide('cipForm', props)
    return () => <Component></Component>
  }
})
