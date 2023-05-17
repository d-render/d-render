import { ref } from 'vue'
import { CipForm } from 'd-render'
import { elFormFieldConfig, aFormFieldConfig } from './config'
import styles from './index.module.less'
export default {
  name: 'CipFormTest',
  setup () {
    const model = ref({ default: 'xmf', input: 'xmf@citycloud.com.cn', rate: 5, checkbox: [] })
    return () => <div class={styles.wrapper}>
      <div class={styles.item}>
        <CipForm
          labelPosition={'top'}
          grid={24}
          v-model:model={model.value}
          fieldList={elFormFieldConfig}
          border={true}
        />
      </div>
      <div class={styles.item}>
         <CipForm
          labelPosition={'top'}
          grid={24}
          v-model:model={model.value}
          fieldList={aFormFieldConfig}
          border={true}
         />
      </div>
    </div>
  }
}
