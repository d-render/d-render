import { DrFormDesign } from '@d-render/design'
import { Promotion } from '@element-plus/icons-vue'
import '@d-render/design/dist/index.css'
import PlInfo from '@cip/components/page-layout/info'
import { componentsGroupList } from './config'
import CipButton from '@cip/components/cip-button'
import './widgets/drawing/index.less'
import { ref } from 'vue'
export default {
  setup () {
    const schema = ref({})
    const equipment = ref('pc')
    return () => <PlInfo hideHeader={true}>
      <DrFormDesign
        style={'background: #fff'}
        componentsGroupList={componentsGroupList}
        v-model:schema={schema.value}
        v-model:equipment={equipment.value}
      >
        {{
          title: () => <span class={'font-20'}>CIP可视化编辑器</span>,
          handle: () => <>
            <CipButton type={'success'} icon={Promotion}>发布</CipButton>
          </>
        }}
      </DrFormDesign>
    </PlInfo>
  }
}
