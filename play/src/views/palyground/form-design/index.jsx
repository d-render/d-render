import { DrFormDesign } from '@d-render/design'
import { Promotion } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import '@d-render/design/dist/index.css'
import PlInfo from '@cip/components/page-layout/info'
import { componentsGroupList } from './config'
import CipButton from '@cip/components/cip-button'
import CipMessage from '@cip/components/cip-message'
import { ref } from 'vue'
import { isJson } from '@cip/utils/util'
import { TplNav, tplModuleConfig } from './plugins/tpl'
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

const useTpl = () => {
  const tplList = ref([])
  const initTpl = () => {
    tplList.value = [
      { name: '', code: '' }
    ]
  }
  const saveTpl = (codesource) => {
    ElMessageBox.prompt({
      type: 'input'
    }).then(val => {

    })
  }

  return {
    tplList,
    initTpl,
    saveTpl
  }
}
export default {
  setup () {
    const { get, set } = useVirtualSchema()
    const { tplList, initTpl, saveTpl } = useTpl()
    const schema = ref(get())
    const equipment = ref('pc')

    initTpl()
    const publish = () => {
      set(schema.value)
      CipMessage.success('发布成功')
    }

    const customModules = [tplModuleConfig]

    return () => <PlInfo hideHeader={true}>
      <DrFormDesign
        style={'background: #fff'}
        componentsGroupList={componentsGroupList}
        modules={customModules}
        v-model:schema={schema.value}
        v-model:equipment={equipment.value}
      >
        {{
          title: () => <span class={'font-20'}>CIP可视化编辑器</span>,
          nav: ({ name }) => <>
            {name === tplModuleConfig.name && <TplNav list={tplList.value}/>}
          </>,
          handle: () => <>
            <CipButton type={'primary'} icon={Promotion} onClick={() => { saveTpl(schema.value) }}>保存模版</CipButton>
            <CipButton type={'success'} icon={Promotion} onClick={() => { publish() }}>发布</CipButton>
          </>
        }}
      </DrFormDesign>
    </PlInfo>
  }
}
