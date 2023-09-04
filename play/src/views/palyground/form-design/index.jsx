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
import {
  CodeSourcePlugin,
  StructurePlugin,
  PalettePlugin,
  FieldConfigurePlugin,
  FormConfigurePlugin
} from '@d-render/design/esm/plugins'
import { TplNavPlugin } from './plugins/tpl'
import { CssConfigurePlugin } from './plugins/css'
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
    const data = localStorage.getItem('tpl')
    if (data) {
      tplList.value = data
        ? JSON.parse(data)
        : []
    }
  }
  const saveTpl = (source) => {
    ElMessageBox.prompt('模版名称', '保存模版', {
      inputValidator: val => !!val.trim(),
      inputPlaceholder: '请输入模版名称',
      inputErrorMessage: '请输入模版名称'
    }).then(val => {
      tplList.value.push({ name: val, source })
      localStorage.setItem('tpl', JSON.stringify(tplList.value))
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

    const tplNavPlugin = new TplNavPlugin({
      data: tplList.value
    })

    const plugins = [
      new PalettePlugin({
        data: componentsGroupList
      }),
      new StructurePlugin(),
      new CodeSourcePlugin(),
      tplNavPlugin,
      new FieldConfigurePlugin(),
      new CssConfigurePlugin(),
      new FormConfigurePlugin()
    ]

    const drawTypeMap = {
      table: 'tableDesign'
    }
    return () => <PlInfo hideHeader={true}>
      <DrFormDesign
        style={'background: #fff'}
        v-model:schema={schema.value}
        v-model:equipment={equipment.value}
        drawTypeMap={drawTypeMap}
        plugins={plugins}
      >
        {{
          title: () => <span class={'font-20'}>CIP可视化表单编辑器</span>,
          preHandle: () => <>
             <CipButton text icon={tplNavPlugin.config.icon} onClick={() => { saveTpl(schema.value) }}>保存模版</CipButton>
          </>,
          handle: () => <>
            <CipButton type={'success'} icon={Promotion} onClick={() => { publish() }}>发布</CipButton>
          </>
        }}
      </DrFormDesign>
    </PlInfo>
  }
}
