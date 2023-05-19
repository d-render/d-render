import { CipForm } from 'd-render'
import { formFieldList } from './config'
import { onMounted, ref } from 'vue'
import CipPageLayoutHandle from '@cip/components/page-layout/handle'
export default {
  name: 'CipFormGanged',
  setup () {
    const model = ref({ a: '1' })

    onMounted(() => {
      // setTimeout(() => {
      setTimeout(() => {
        model.value = { a: '2' }
      }, 1000)
      setTimeout(() => {
        model.value = { a: '3' }
      }, 2000)
      setTimeout(() => {
        model.value = { a: '4' }
      }, 3000)
      // }, 100)
    })

    return () => <CipPageLayoutHandle>
      <CipForm
        v-model:model={model.value}
        fieldList={formFieldList}
      />
    </CipPageLayoutHandle>
  }
}
