import { DrBasicDesign } from '@d-render/design'
import { Promotion } from '@element-plus/icons-vue'
import '@d-render/design/dist/index.css'
import PlInfo from '@cip/components/page-layout/info'
import { componentsGroupList } from './config'
import CipButton from '@cip/components/cip-button'
import CipMessage from '@cip/components/cip-message'
import { ref } from 'vue'
import {
  CodeSourcePlugin,
  StructurePlugin,
  PalettePlugin,
  FieldConfigurePlugin,
  DrawTablePlugin
} from '@d-render/design/esm/plugins'
import { TplNavPlugin } from '../custom-form-design/plugins/tpl'
import { useVirtualSchema } from '../use-virtual-schema'
import { useTpl } from '../use-tpl'

export default {
  setup () {
    const { set } = useVirtualSchema('tableDesign')
    const { tplList, initTpl, saveTpl } = useTpl('tableTpl')
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
          title: () => <span class={'font-20'}>CIP可视化《表格》编辑器</span>,
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
