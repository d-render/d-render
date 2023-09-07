// 此组件依赖于DRender的table组件
import { getH5InputComponent, getInputComponent } from '../cip-form-item/util'
import { h, provide } from 'vue'
export default {
  props: {
    schema: {},
    model: {},
    equipment: { type: String, default: 'pc' },
    service: Object
  },
  setup (props) {
    const Component = () => {
      const tableProps = {
        modelValue: props.model,
        config: {
          options: [{
            key: 'default',
            children: props.schema.list
          }]
        }
      }
      if (props.equipment === 'pc') {
        return h(getInputComponent('table'), tableProps)
      } else {
        return h(getH5InputComponent('table'), tableProps)
      }
    }
    provide('cipForm', props)
    return () => <Component >

    </Component>
  }
}
