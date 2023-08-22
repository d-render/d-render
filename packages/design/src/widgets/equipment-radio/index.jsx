import { ElIcon } from 'element-plus'
import { useNamespace } from '@d-render/shared'
import { PC, Mobile } from '@/svg'
export default {
  props: {
    modelValue: {}
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    const ns = useNamespace('equipment-radio')
    const change = (value) => {
      emit('update:modelValue', value)
      emit('change', value)
    }
    const options = [
      {
        value: 'pc', svg: PC
      },
      {
        value: 'mobile', svg: Mobile
      }
    ]
    // 'equipment-radio__option' 'equipment-radio__option--active'
    return () => <div class={ns.b()}>
      {(options || []).map(option => (
        <div
          class={[ns.e('option'), { [ns.is('active')]: option.value === props.modelValue }]}
          onClick={() => change(option.value)}>
          <ElIcon >{option.svg.render()}</ElIcon>
        </div>))}
    </div>
  }
}
