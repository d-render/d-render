import { CipTable } from 'd-render'
export default {
  props: {
    schema: {},
    model: {},
    equipment: {}
  },
  emits: ['update:model'],
  setup (props, { emit }) {
    // 初始化model
    emit('update:model', [])
    return () => {
      const { list = [], ...tableConfig } = props.schema || {}
      return <CipTable
        {...tableConfig}
        data={props.model}
        onUpdate:data={(val) => emit('update:model', val)}
        columns={list}
      />
    }
  }
}
