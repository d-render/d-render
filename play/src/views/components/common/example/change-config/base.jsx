// jsx
import { ref } from 'vue'
import { formFieldList } from './config'
import { CipForm } from 'd-render'

export default {
  name: 'changeValueBase',
  setup () {
    const model = ref({})

    return () => <CipForm
      labelWidth={'60px'}
      v-model:model={model.value}
      fieldList={formFieldList}
    />
  }
}
