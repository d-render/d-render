import { computed, ref, watch } from 'vue'
import { CipFormRender } from 'd-render'
import { useNamespace } from '@d-render/shared'
import { CipButton } from '@xdp/button'
import { View } from '@element-plus/icons-vue'
import DesignLayout from '@/widgets/layout'
import DesignModules from '@/widgets/modules'
import { EditorRenderer, EditorOutline, EditorCode, EditorTpl } from '@/svg'
import Structure from '@/widgets/aside/structure'
import EquipmentRadio from '@/widgets/equipment-radio'
import CodeSource from '@/widgets/aside/code-source'
import FormComponents from '@/widgets/aside/component-group'
import Property from '@/widgets/property'

import Drawing from '@/widgets/drawing'

import { useSelect } from '@/hooks/use-select'

export default {
  props: {
    schema: {},
    equipment: {},
    componentsGroupList: {}
  },
  emits: ['update:schema', 'update:config', 'update:equipment'],
  setup (props, { emit, slots }) {
    const ns = useNamespace('form-design')
    const defaultModules = [
      { name: 'renderer', title: '组件', icon: <EditorRenderer/> },
      { name: 'structure', title: '结构', icon: <EditorOutline/> },
      { name: 'code', title: '源码', icon: <EditorCode/> },
      { name: 'tpl', title: '模版', icon: <EditorTpl/> }
    ]
    const currentModuleName = ref('renderer')
    const { selectItem, selectItemId, changeSelect, updateSelectItem } = useSelect()

    const updateSchema = (schema) => {
      console.log(schema)
      // 进入使用designType 出来使用type
      emit('update:schema', schema)
    }
    const updateConfig = (config) => {
      const scheme = props.schema
      scheme.config = config
      emit('update:config', config)
    }
    const updateList = (list) => {
      const schema = props.schema
      schema.list = list
      updateSchema(schema)
    }
    const updateEquipment = (equipment) => {
      emit('update:equipment', equipment)
    }

    const initSchema = () => ({
      list: [], // 组件渲染配置
      init: [], // 初始化时需要调用的methods
      methods: [], // 提供给当前页面使用的methods
      grid: 1
    })
    const navTitle = computed(() => {
      const item = defaultModules.find(i => i.name === currentModuleName.value) ?? {}
      return item.title
    })
    watch(() => props.schema, (val) => {
      if (!val) {
        // 如果scheme为空则直接进行初始化
        updateSchema(initSchema())
      }
    }, { immediate: true })
    const isPreview = ref(false)
    const togglePreview = () => {
      isPreview.value = !isPreview.value
    }
    const testModel = ref({})
    return () => <DesignLayout navTitle={navTitle.value} class={[ns.b()]} preview={isPreview.value}>
      {{
        title: () => slots.title?.(),
        equipment: () => <EquipmentRadio modelValue={props.equipment} onUpdate:modelValue={updateEquipment}/>,
        handle: () => <>
          {!isPreview.value && <>
            <CipButton type={'primary'} icon={View} onClick={() => { togglePreview() }}>预览</CipButton>
            {slots.handle?.()}
          </>}
          {
            isPreview.value && <CipButton type={'primary'} onClick={() => { togglePreview() }}>编辑</CipButton>
          }
        </>,
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
          {currentModuleName.value === 'code' && <CodeSource modelValue={props.schema} onUpdate:modelValue={updateSchema}></CodeSource>}
          {currentModuleName.value === 'renderer' && <FormComponents groupList={props.componentsGroupList}/>}
          {slots.nav?.({ name: currentModuleName.value })}
        </>,
        content: () => <Drawing
          equipment={props.equipment}
          data={props.schema}
          selectId={selectItemId.value}
          onSelect={(item) => changeSelect(item)}
          onUpdateList={(list) => { updateList(list) }}
        />,
        configure: () => <Property
          selectItem={selectItem.value}
          data={props.schema}
          onUpdate:selectItem={(val) => updateSelectItem(val)}
        >
          {{ default: ({ name }) => slots.property({ name }) }}
        </Property>,
        preview: () => <CipFormRender v-model:model={testModel.value} scheme={props.schema} equipment={props.equipment}/>
      }}
    </DesignLayout>
  }
}
