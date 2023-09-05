import { CipTable } from 'd-render'
import { CipButtonText } from '@xdp/button'
import { Plus } from '@element-plus/icons-vue'

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
    const handleAdd = () => {
      emit('update:model', [...props.model, {}])
    }
    return () => {
      const { list = [], ...tableConfig } = props.schema || {}
      return <div class={'dr-table-preview--table'}>
        <CipTable
          {...tableConfig}
          withTableHandle={true}
          data={props.model}
          onUpdate:data={(val) => emit('update:model', val)}
          columns={list}
          v-slots={
            {
              $handler: () => <div class={'dr-table-preview--handler'}>
                <CipButtonText>新增</CipButtonText>
                <CipButtonText>删除</CipButtonText>
              </div>
            }
          }
        >
        </CipTable>
        <CipButtonText icon={Plus} onClick={handleAdd}>添加</CipButtonText>
      </div>
    }
  }
}
