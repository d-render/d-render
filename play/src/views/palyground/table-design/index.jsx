import { DrTableDesign } from '@d-render/design'
import { Promotion } from '@element-plus/icons-vue'
import '@d-render/design/dist/index.css'
import PlInfo from '@cip/page-layout/info'
import { componentsGroupList } from './config'
import CipButton from '@cip/components/cip-button'
import CipMessage from '@cip/components/cip-message'
import { ref } from 'vue'
import {
  TableDrawPlugin,
  TablePreviewPlugin
} from '@d-render/design/esm/plugins'
import { TplNavPlugin } from '../custom-form-design/plugins/tpl'
import { useVirtualSchema } from '../use-virtual-schema'
import { useTpl } from '../use-tpl'

export default {
  setup () {
    const { set, get } = useVirtualSchema('tableDesign')
    const { tplList, initTpl, saveTpl } = useTpl('tableTpl')
    const schema = ref(get())
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
      tplNavPlugin,
      new TableDrawPlugin(),
      new TablePreviewPlugin()
    ]
    return () => <PlInfo hideHeader={true}>
      <DrTableDesign
        drawTypeMap={drawTypeMap}
        v-model:schema={schema.value}
        componentsGroupList={componentsGroupList}
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
      </DrTableDesign>
    </PlInfo>
  }
}
