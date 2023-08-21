import { ElIcon } from 'element-plus'
import { useNamespace } from '@d-render/shared'
export default {
  props: {
    modelValue: String,
    modules: Array
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const ns = useNamespace('design-modules')
    return () => <div class={ns.e('wrapper')}>
      {props.modules.map(module => <div
        key={module.name}
        class={[
          ns.e('item'),
          props.modelValue === module.name ? ns.is('active') : undefined]
        }
        onClick={() => { emit('update:modelValue', module.name) }}
      >
        <ElIcon style={'font-size: 18px;'}>{module.icon}</ElIcon>
      </div>)}
    </div>
  }
}
