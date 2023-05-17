import { ref } from 'vue'
import { CipForm } from 'd-render'
export default {
  setup () {
    const fieldList = [{
      key: 'name',
      config: {
        required: true,
        label: 'name',
        type: 'input',
        clearable: true,
        placeholder: 'placeholder test',
        showWordLimit: true,
        maxlength: 12
      }
    }, {
      key: 'email',
      config: {
        type: 'default',
        label: 'E-mail',
        required: true,
        border: true
      }
    }, {
      key: 'rate',
      config: {
        type: 'rate',
        label: '评分'
      }
    }]
    const model = ref({ name: 'xmf', email: 'xmf@citycloud.com.cn', reta: 5 })
    return () => <>
      {JSON.stringify(model.value)}
        <CipForm
          v-model:model={model.value}
          fieldList={fieldList}
          border={true}
        />
      </>
  }
}
