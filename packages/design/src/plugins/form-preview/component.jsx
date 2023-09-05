import { CipFormRender } from 'd-render'
export default {
  props: {
    schema: {},
    model: {},
    equipment: {}
  },
  setup (props, { emit }) {
    emit('update:model', {})
    return () => <CipFormRender
      model={props.model}
      onUpdate:model={(val) => emit('update:model', val)}
      schema={props.schema}
    />
  }
}
