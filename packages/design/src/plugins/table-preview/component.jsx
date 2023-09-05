import {CipForm, CipFormItem, CipTable} from 'd-render'
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
    const handleDelete = () => {
      emit('update:model', props.model.filter((_, index) => index !== props.model.length - 1))
    }
    return () => {
      console.log(props.model, 'props.model')
      const { list = [], ...tableConfig } = props.schema || {}
      const mobile = () => {
        return <CipForm fieldList={[]} readonly={true}>
          {
            list?.map((option, index) => <CipFormItem
              key={index}
              model={props.model[index]}
              onUpdate:model={(val) => {
                const modelList = [...props.model]
                modelList[index] = val
                console.log(modelList, 'modelList', val)
                emit('update:model', modelList)
              }}
              config={option.config}
              inTable={true}
            ></CipFormItem>)
          }
        </CipForm>
      }
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
                <CipButtonText onClick={handleDelete}>删除</CipButtonText>
              </div>
            }
          }
        >
        </CipTable>
        <CipButtonText icon={Plus} onClick={handleAdd}>添加</CipButtonText>
      </div>
      return props.equipment === 'pc' ? pc() : mobile()
    }
  }
}
