import { elFormFieldConfig } from './config'
import CipPageLayoutInfo from '@cip/components/page-layout/info'
import { CipForm } from 'd-render'
import { ref } from 'vue'
import styles from './index.module.less'
export default {
  name: 'standardOverview',
  setup () {
    const model = ref({})
    return () => <CipPageLayoutInfo theme={'dg'}>
      <div class={styles.wrapper}>
        <div class={styles.item}>
          <CipForm
            labelPosition={'top'}
            grid={24}
            v-model:model={model.value}
            fieldList={[{ key: 'st', config: { type: 'staticInfo', staticInfo: 'writable status', span: 24 } }].concat(elFormFieldConfig)}
          />
        </div>
        <div class={styles.item}>
          <CipForm
            labelPosition={'top'}
            labelWidth={'120px'}
            grid={24}
            model={model.value}
            fieldList={[{ key: 'st', config: { type: 'staticInfo', staticInfo: 'readable status', span: 24 } }].concat(elFormFieldConfig)}
            showOnly={true}
          />
        </div>
      </div>
      </CipPageLayoutInfo>
  }
}
