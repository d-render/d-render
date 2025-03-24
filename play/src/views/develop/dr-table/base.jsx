import { DrTable, generateFieldList } from 'd-render'
import { CipButton } from '@xdp/button'
import { ref } from 'vue'
export default {
  setup () {
    const data = ref([])
    const columns = generateFieldList({
      name: { type: 'input', label: '姓名', writable: true },
      sex: { type: 'radio', label: '性别', options: [{ value: 1, label: '男' }, { value: 2, label: '女' }], writable: true },
      education: {
        type: 'select',
        label: '学历',
        options: [{ value: 1, label: '研究生' }, { value: 2, label: '本科' }],
        writable: false,
        dependOn: ['sex'],
        dynamic: true,
        changeConfig: (config, { sex }) => {
          console.log('sex', sex)
          if (sex) {
            config.writable = true
          } else {
            config.writable = false
          }
          return config
        }
      }
    })
    const addRow = () => {
      data.value.push({})
    }
    const editType = ref('row')
    return () => <div>
      <CipButton onClick={() => { editType.value = 'all' }}>全表编辑</CipButton>
      <CipButton onClick={() => { editType.value = 'row' }}>行编辑</CipButton>
      <DrTable offset={0} v-model:data={data.value} columns={columns} editType={editType.value}></DrTable>
      <CipButton onClick={addRow}>添加行</CipButton>
    </div>
  }
}
