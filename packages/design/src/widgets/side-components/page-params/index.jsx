import { CipForm } from 'd-render'
import { formFieldList } from './config'
export default {
  props: {
    modelValue: Object
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    return () => <div>
      <CipForm
        model={props.modelValue}
        onUpdate:model={(val) => emit('update:modelValue', val)}
        fieldList={formFieldList}
      />
    </div>
  }
}
