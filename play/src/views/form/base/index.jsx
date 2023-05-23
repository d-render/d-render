import { ref, computed } from 'vue'
import { CipForm } from 'd-render'
import { elFormFieldConfig, aFormFieldConfig } from './config'
import CipPageLayoutInfo from '@cip/components/page-layout/info'
import CipTabs from '@cip/components/cip-tabs'
import styles from './index.module.less'
export default {
  name: 'CipFormTest',
  setup () {
    const model = ref({ default: 'xmf', input: 'xmf@citycloud.com.cn', rate: 5, checkbox: [] })
    const activeTab = ref('ep')
    const formFieldList = computed(() => {
      switch (activeTab.value) {
        case 'ep': return elFormFieldConfig
        case 'antdv': return aFormFieldConfig
        default: return elFormFieldConfig
      }
    })
    return () => <CipPageLayoutInfo >
      <div>
        <div style={'background: #fff; padding: 12px'}>
          <CipTabs v-model:active={activeTab.value}>
            <CipTabs.Tab name={'ep'} >d-render-plugin-standard(element-plus)</CipTabs.Tab>
            <CipTabs.Tab name={'cip'}>@cci/d-render-plugin-cci</CipTabs.Tab>
            <CipTabs.Tab name={'antdv'}>ant design vue(developing)</CipTabs.Tab>
          </CipTabs>
        </div>
        <div class={styles.wrapper} >
          <div class={styles.item}>
            <CipForm
              labelPosition={'top'}
              grid={24}
              v-model:model={model.value}
              fieldList={formFieldList.value}
              border={true}
            />
          </div>
          <div class={styles.item}>
            <CipForm
              labelPosition={'top'}
              labelWidth={'120px'}
              grid={24}
              v-model:model={model.value}
              fieldList={formFieldList.value}
              border={true}
              showOnly={true}
            />
          </div>
        </div>
      </div>
    </CipPageLayoutInfo>
  }
}
