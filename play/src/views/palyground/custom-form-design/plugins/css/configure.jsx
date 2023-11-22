import { CipForm, generateFieldList } from 'd-render'
export default {
  props: {
    selectItem: {},
    schema: {}
  },
  emits: ['update:selectItem'],
  setup (props, { emit }) {
    const fieldList = generateFieldList({
      'config.span': { type: 'number', label: '占位', min: 1, max: props.schema.grid ?? 1 }
    })
    return () => <CipForm
      model={props.selectItem}
      labelPosition={'top'}
      onUpdate:model={(val) => emit('update:selectItem', val)}
      fieldList={fieldList}
    />
  }
}
