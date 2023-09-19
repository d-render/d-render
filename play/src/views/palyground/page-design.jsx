import { DrPageDesign } from '@d-render/design'
import { Promotion } from '@element-plus/icons-vue'
import '@d-render/design/dist/index.css'
import PlInfo from '@cip/page-layout/info'
import { componentsGroupList } from './custom-form-design/config'
import CipButton from '@cip/components/cip-button'
import CipMessage from '@cip/components/cip-message'
import { ref } from 'vue'
import { useVirtualSchema } from './use-virtual-schema'

export default {
  setup () {
    const { get, set } = useVirtualSchema('pageSchema')
    const schema = ref(get())
    const equipment = ref('pc')
    const publish = () => {
      set(schema.value)
      CipMessage.success('发布成功')
    }
    const drawTypeMap = {
      table: 'tableDesign'
    }
    const putStrategy = {
      table: (dom) => !dom.classList.contains('disabled-table')
    }
    return () => <PlInfo hideHeader={true}>
      <DrPageDesign
        v-model:schema={schema.value}
        v-model:equipment={equipment.value}
        drawTypeMap={drawTypeMap}
        putStrategy={putStrategy}
        componentsGroupList={componentsGroupList}
      >
        {{
          title: () => <span class={'font-20'}>CIP可视化《页面》编辑器</span>,
          handle: () => <>
            <CipButton type={'success'} icon={Promotion} onClick={() => { publish() }}>发布</CipButton>
          </>
        }}
      </DrPageDesign>
    </PlInfo>
  }
}
