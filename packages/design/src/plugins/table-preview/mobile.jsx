import {CipButtonText} from '@xdp/button'
import { Plus } from '@element-plus/icons-vue'
import { CipForm, CipFormItem } from 'd-render'

export default {
  props: {
    model: {},
    schema: {},
    fieldKey: {},
    dependOnValues: {}
  },
  emit: ['add', 'delete'],
  setup (props, { emit }) {
    const updateModelValue = (val, index) => {
      const data = props.model
      data[index] = val
      emit('update:model', data)
    }
    const handleAdd = () => {
      emit('add')
    }
    const handleDelete = (index) => {
      emit('delete', index)
    }
    const { list = [], ...tableConfig } = props.schema || {}
    return () => <CipForm fieldList={[]} readonly={true} class={'dr-table-preview--mobile'}>
      {
        props.model.map((row, rowIndex) =><div>
          {
            list.map((col, colIndex) => {
              const inputConfig = { ...col.config }
              inputConfig.width = '100%'
              inputConfig.ruleKey = `${props.fieldKey}.${rowIndex}.${col.key}`
              return <div>
                <CipFormItem
                  key={`${rowIndex}-${colIndex}`}
                  model={row}
                  config={inputConfig}
                  inTable={true}
                  tableData={props.model}
                  tableDependOnValues={props.dependOnValues}
                  fieldKey={col.key}
                  onUpdate:model={
                    (val) => {
                      row = val
                      updateModelValue(val, rowIndex)
                    }
                  }
                />
              </div>
            })
          }
          <div class={'dr-table-preview--mobile__delete'}>
            <CipButtonText onClick={() => handleDelete(rowIndex)}>删除</CipButtonText>
          </div>
        </div>)
      }
      <div class={'dr-table-preview--mobile__add'}>
        <CipButtonText icon={Plus} onClick={handleAdd}>添加</CipButtonText>
      </div>
    </CipForm>
  }
}
