import { DrFormDesign } from '@d-render/design'
import { Promotion } from '@element-plus/icons-vue'
import '@d-render/design/dist/index.css'
import PlInfo from '@cip/components/page-layout/info'
import { componentsGroupList } from './custom-form-design/config'
import CipButton from '@cip/components/cip-button'
import CipMessage from '@cip/components/cip-message'
import { ref } from 'vue'
import { isJson } from '@cip/utils/util'

const useVirtualSchema = () => {
  const fieldKey = 'formSchema'
  const get = () => {
    let val = localStorage.getItem(fieldKey)
    if (isJson(val)) val = JSON.parse(val)
    return val ?? {}
  }
  const set = (val) => {
    if (typeof val === 'object') val = JSON.stringify(val)
    return localStorage.setItem(fieldKey, val)
  }
  return {
    get,
    set
  }
}

export default {
  setup () {
    const { get, set } = useVirtualSchema()
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
      <DrFormDesign
        style={'background: #fff'}
        v-model:schema={schema.value}
        v-model:equipment={equipment.value}
        drawTypeMap={drawTypeMap}
        putStrategy={putStrategy}
        componentsGroupList={componentsGroupList}
      >
        {{
          title: () => <span class={'font-20'}>CIP可视化表单编辑器</span>,
          handle: () => <>
            <CipButton type={'success'} icon={Promotion} onClick={() => { publish() }}>发布</CipButton>
          </>
        }}
      </DrFormDesign>
    </PlInfo>
  }
}
