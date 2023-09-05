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
  FormConfigurePlugin,
  DrawFormPlugin
} from '@d-render/design/esm/plugins'
import { TplNavPlugin } from './plugins/tpl'
import { CssConfigurePlugin } from './plugins/css'
import { useVirtualSchema } from '../use-virtual-schema'
import { useTpl } from '../use-tpl'

export default {
  setup () {
    const { get, set } = useVirtualSchema('customFormSchema')
    const { tplList, initTpl, saveTpl } = useTpl('tpl')
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
      new FormConfigurePlugin(),
      new DrawFormPlugin()
    ]
    const drawTypeMap = {
      table: 'tableDesign'
    }
    const putStrategy = {
      table: (dom) => !dom.classList.contains('disabled-table')
    }
    return () => <PlInfo hideHeader={true}>
      <DrBasicDesign
        style={'background: #fff'}
        v-model:schema={schema.value}
        v-model:equipment={equipment.value}
        drawTypeMap={drawTypeMap}
        plugins={plugins}
        putStrategy={putStrategy}
      >
        {{
          title: () => <span class={'font-20'}>CIP可视化《表单》编辑器</span>,
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
