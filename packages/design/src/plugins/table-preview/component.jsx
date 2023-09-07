import { CipForm, CipFormItem, CipTable } from 'd-render'
import { CipButtonText } from '@xdp/button'
import Mobile from './mobile'
import { Plus } from '@element-plus/icons-vue'

export default {
  props: {
    schema: {},
    model: {
      default: () => []
    },
    equipment: {},
    dependOnValues: {}
  },
  emits: ['update:model'],
  setup (props, { emit }) {
    // 初始化model
    emit('update:model', [])
    const handleAdd = () => {
      emit('update:model', [...props.model, {}])
    }
    const handleDelete = (index) => {
      emit('update:model', props.model.filter((_, idx) => index !== idx))
    }
    const updateModelValue = (val, index) => {
      const data = props.model
      data[index] = val
      emit('update:model', data)
    }
    return () => {
      const { list = [], ...tableConfig } = props.schema || {}
      const pc = () => <div class={'dr-table-preview--table'}>
        <CipTable
          {...tableConfig}
          withTableHandle={true}
          data={props.model}
          onUpdate:data={(val) => emit('update:model', val)}
          columns={list}
          v-slots={
            {
              $handler: () => <div class={'dr-table-preview--handler'}>
                <CipButtonText onClick={handleAdd}>新增</CipButtonText>
                <CipButtonText onClick={(_, index) => handleDelete(index)}>删除</CipButtonText>
              </div>
            }
          }
        >
        </CipTable>
        <CipButtonText icon={Plus} onClick={handleAdd}>添加</CipButtonText>
      </div>
      return props.equipment === 'pc' ? pc() : <Mobile model={props.model} schema={props.schema} onAdd={handleAdd} onDelete={handleDelete} onUpdate:model={updateModelValue}></Mobile>
    }
  }
}
