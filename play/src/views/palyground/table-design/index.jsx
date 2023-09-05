import { DrBasicDesign } from '@d-render/design'
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
  DrawTablePlugin
} from '@d-render/design/esm/plugins'
import { TplNavPlugin } from '../custom-form-design/plugins/tpl'
import { useVirtualSchema } from '../use-virtual-schema'

const useTpl = () => {
  const tplList = ref([])
  const initTpl = () => {
    const data = localStorage.getItem('tableTpl')
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
    const { set } = useVirtualSchema('tableDesign')
    const { tplList, initTpl, saveTpl } = useTpl()
    const schema = ref({})
    const equipment = ref('pc')

    initTpl()
    const publish = () => {
      set(schema.value)
      CipMessage.success('发布成功')
    }

    const drawTypeMap = {
      table: 'tableDesign'
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
      new DrawTablePlugin()
    ]
    return () => <PlInfo hideHeader={true}>
      <DrBasicDesign
        drawTypeMap={drawTypeMap}
        style={'background: #fff'}
        v-model:schema={schema.value}
        plugins={plugins}
        v-model:equipment={equipment.value}
      >
        {{
          title: () => <span class={'font-20'}>CIP可视化表格编辑器</span>,
          preHandle: () => <>
            <CipButton text icon={tplNavPlugin.config.icon} onClick={() => { saveTpl(schema.value) }}>保存模版</CipButton>
          </>,
          handle: () => <>
            <CipButton type={'success'} icon={Promotion} onClick={() => { publish() }}>发布</CipButton>
          </>
        }}
      </DrBasicDesign>
    </PlInfo>
  }
}
