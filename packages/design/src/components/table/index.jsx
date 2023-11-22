import BasicDesign from '../basic'
import {
  CodeSourcePlugin,
  StructurePlugin,
  PalettePlugin,
  FieldConfigurePlugin,
  FormDrawPlugin,
  FormPreviewPlugin,
  TableConfigurePlugin
} from '@/plugins'
import { ref } from 'vue'
export default {
  name: 'DrTableDesign',
  props: {
    componentsGroupList: Object,
    schema: Object,
    equipment: String,
    drawTypeMap: Object,
    defaultModule: String,
    defaultConfigure: String,
    putStrategy: Object,
    plugins: { type: Array, default: () => [] }
  },
  emits: ['update:schema'],
  setup (props, { slots, emit }) {
    const defaultPlugin = [
      new PalettePlugin({
        data: props.componentsGroupList
      }),
      new StructurePlugin(),
      new CodeSourcePlugin(),
      new FieldConfigurePlugin(),
      new FormDrawPlugin(),
      new FormPreviewPlugin(),
      new TableConfigurePlugin()
    ]
    const equipment = ref('pc')
    const pluginBridge = defaultPlugin.concat(props.plugins)
    return () => {
      const { plugins, ...designProps } = props
      return <BasicDesign
        {...designProps}
        v-model:equipment={equipment.value}
        onUpdate:schema={(val) => emit('update:schema', val)}
        plugins={pluginBridge}
        v-slots={slots}
      />
    }
  }
}
