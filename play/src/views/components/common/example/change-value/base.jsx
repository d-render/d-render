// jsx
import { ref } from 'vue'
import { formFieldList } from './config'
import { CipForm } from 'd-render'

export default {
  name: 'changeValueBase',
  setup () {
    const model = ref({})

    const mockRequest = (val) => {
      setTimeout(() => {
        model.value = val
      }, 1000)
    }
    mockRequest({ a: 2 })

    return () => <CipForm
      labelWidth={'60px'}
      v-model:model={model.value}
      fieldList={formFieldList}
    />
  }
}
