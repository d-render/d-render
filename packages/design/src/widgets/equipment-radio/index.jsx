import { ElIcon } from 'element-plus'
import { PC, Mobile } from '@/svg'
export default {
  props: {
    modelValue: {},
    options: {}
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    const change = (value) => {
      emit('update:modelValue', value)
      emit('change', value)
    }
    const options = [{
      value: 'pc', svg: PC
    }, {
      value: 'mobile', svg: Mobile
    }]
    return () => <div class={'equipment-radio'}>
      {(options || []).map(option => (
        <div
          class={['equipment-radio__option', { 'equipment-radio__option--active': option.value === props.modelValue }]}
          onClick={() => change(option.value)}>
          <ElIcon size={14} >{option.svg.render()}</ElIcon>
        </div>))}
    </div>
  }
}
