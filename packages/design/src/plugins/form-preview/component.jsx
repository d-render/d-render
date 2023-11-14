import { CipFormRender } from 'd-render'
export default {
  props: {
    schema: {},
    model: {},
    equipment: {}
  },
  setup (props, { emit }) {
    console.log('form-preview setup')
    emit('update:model', {})
    // [tip]: key为空对象是为了防御预览/设计时复用
    return () => <CipFormRender
      key={{}}
      model={props.model}
      onUpdate:model={(val) => emit('update:model', val)}
      schema={props.schema}
      equipment={props.equipment}
    />
  }
}
