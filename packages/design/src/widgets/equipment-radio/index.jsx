import { ElIcon } from 'element-plus'
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
    return () => <div class={'equipment-radio'}>
      {(props.options || []).map(option => (
        <div
          class={['equipment-radio__option', { 'equipment-radio__option--active': option.value === props.modelValue }]}
          onClick={() => change(option.value)}>
          <ElIcon size={14} >{option.svg.render()}</ElIcon>
        </div>))}
    </div>
  }
}
