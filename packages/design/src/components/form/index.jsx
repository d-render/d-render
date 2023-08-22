import { ref } from 'vue'
import { useNamespace } from '@d-render/shared'
import DesignLayout from '@/widgets/layout'
import DesignModules from '@/widgets/modules'
import { EditorRenderer, EditorOutline, EditorCode, EditorTpl } from '@/svg'
import Structure from '@/widgets/aside/structure'
import CodeSource from '@/widgets/aside/code-source'
import FormComponents from '@/widgets/aside/component-group'

import Drawing from '@/widgets/drawing'

import { useSelect } from '@/hooks/use-select'

export default {
  props: {
    schema: {},
    componentsGroupList: {}
  },
  emits: ['update:scheme', 'update:config'],
  setup (props, { emit }) {
    const ns = useNamespace('form-design')
    const defaultModules = [
      { name: 'renderer', title: '组件', icon: <EditorRenderer/> },
      { name: 'structure', title: '结构', icon: <EditorOutline/> },
      { name: 'code', title: '源码', icon: <EditorCode/> },
      { name: 'tpl', title: '模版', icon: <EditorTpl/> }
    ]
    const currentModuleName = ref('renderer')
    const { selectItem, selectItemId, changeSelect, updateSelectItem } = useSelect()

    const updateScheme = (schema) => {
      // 进入使用designType 出来使用type
      emit('update:scheme', schema)
    }
    const updateConfig = (config) => {
      const scheme = props.schema
      scheme.config = config
      emit('update:config', config)
    }
    const updateList = (list) => {
      const schema = props.schema
      schema.list = list
      updateScheme(schema)
    }

    return () => <DesignLayout navTitle={currentModuleName.value} class={[ns.b()]}>
      {{
        title: () => '表单设计器',
        handle: () => 'handle',
        modules: () => <DesignModules
          v-model={currentModuleName.value}
          modules={defaultModules}
        />,
        nav: () => <>
          {currentModuleName.value === 'structure' && <Structure
            modelValue={selectItemId.value}
            list={props.schema?.list}
            onUpdate:selectItem={(val) => { selectItem.value = val }}
          />}
          {currentModuleName.value === 'code' && <CodeSource></CodeSource>}
          {currentModuleName.value === 'renderer' && <FormComponents groupList={props.componentsGroupList}/>}
        </>,
        content: () => <Drawing
          data={props.schema}
          selectId={selectItemId.value}
          onSelect={(item) => changeSelect(item)}
          onUpdateList={(list) => { updateList(list) }}
        />,
        configure: () => 'configure'
      }}
    </DesignLayout>
  }
}
