import { ElSelect, ElOption } from 'element-plus'

export default {
  name: 'LSelect',
  props: {
    modelValue: {},
    config: Object
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    return () => <ElSelect
      modelValue={props.modelValue}
      clearable={props.config.clearable ?? true}
      onUpdate:modelValue={(val) => emit('update:modelValue', val)}
    >
      {props.config.options.map(option => <ElOption key={option.value} value={option.value} label={option.value}/>)}
    </ElSelect>
  }
}
