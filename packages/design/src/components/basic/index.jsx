import DeviceContainer from '@/widgets/device-container'
import { computed, ref, watch, reactive, provide } from 'vue'
import { useNamespace } from '@d-render/shared'
import { CipButton } from '@xdp/button'
import { View } from '@element-plus/icons-vue'
import DesignLayout from '@/widgets/layout'
import DesignModules from '@/widgets/modules'
import EquipmentRadio from '@/widgets/equipment-radio'
import Property from '@/widgets/property'

import Drawing from '@/widgets/drawing'
import IframeContainer from './iframe-container'

import { useSelect } from '@/hooks/use-select'
import { useCompose } from '@/hooks/use-compose'
import { usePlugins } from '@/hooks/use-plugins'
import { depthFirstSearchTree } from '@/util'
import Breadcrumb from './breadcrumb'
import { DR_DESIGN_KEY } from '@/constant'
export default {
  props: {
    schema: {},
    equipment: {},
    drawTypeMap: {},
    defaultModule: {},
    defaultConfigure: {},
    putStrategy: {},
    plugins: { type: Array, default: () => [] },
    withPreview: { type: Boolean, default: true },
    previewText: { type: String, default: '预览' },
    editText: { type: String, default: '编辑' }
  },
  emits: ['update:schema', 'update:config', 'update:equipment'],
  setup (props, { emit, slots }) {
    const ns = useNamespace('form-design')
    const { modules, configure, draw, preview, icon } = usePlugins(props.plugins)

    const [currentModuleName, asideModules] = useCompose(props, {
      activeKey: 'defaultModule',
      custom: modules.map(v => v.config)
    })
    const [currentTab, configTabs] = useCompose(props, {
      activeKey: 'defaultConfigure',
      custom: configure.map(v => v.config)
    })

    const { selectItem, selectItemId, changeSelect, updateSelectItem } = useSelect()

    const updateSchema = (schema) => {
      // 进入使用designType 出来使用type
      emit('update:schema', schema)
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
      const item = asideModules.value.find(i => i.name === currentModuleName.value) ?? {}
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
    const testModel = ref()
    const breadcrumb = computed(() => depthFirstSearchTree(
      props.schema?.list || [], selectItemId.value, 'id', props.drawTypeMap) || [])
    const drDesign = reactive({
      drawTypeMap: props.drawTypeMap, // 渲染组件转换对象
      schema: props.schema, // 渲染配置
      putStrategy: props.putStrategy, // 拖入配置
      path: breadcrumb // 当前组件路径
    })
    provide(DR_DESIGN_KEY, drDesign)
    return () => <DesignLayout navTitle={navTitle.value} class={[ns.b()]} preview={isPreview.value}>
      {{
        title: () => slots.title?.(),
        equipment: () => <EquipmentRadio modelValue={props.equipment} onUpdate:modelValue={updateEquipment}/>,
        handle: () => <>
          {props.withPreview && !isPreview.value && <>
            {slots.preHandle?.()}
            <CipButton type={'primary'} icon={View} onClick={() => { togglePreview() }}>{props.previewText}</CipButton>
            {slots.handle?.()}
          </>}
          {
            isPreview.value && <CipButton type={'primary'} onClick={() => { togglePreview() }}>{props.editText}</CipButton>
          }
        </>,
        modules: () => <DesignModules
          v-model={currentModuleName.value}
          modules={asideModules.value}
        />,
        nav: () => <>
          {modules.map(module => {
            const { Component, config } = module
            return config.name === currentModuleName.value && <Component
              key={config.name}
              data={module.options?.data}
              selectItem={selectItem.value}
              onUpdate:selectItem={(val) => { selectItem.value = val }}
              schema={props.schema}
              onUpdate:schema={updateSchema}
            />
          })}
          {slots.nav?.({ name: currentModuleName.value })}
        </>,
        content: () => <>
        {
          <Breadcrumb list={breadcrumb.value} draw={draw} onItemClick={item => selectItem.value = item}></Breadcrumb>
        }
          <Drawing
            Component={draw.Component}
            handleIconComponent={icon}
            equipment={props.equipment}
            data={props.schema}
            selectId={selectItemId.value}
            onSelect={(item) => changeSelect(item)}
            onUpdateList={(list) => { updateList(list) }}
          />
        </>,
        configure: () =>
          <Property
            v-model:active={currentTab.value}
            selectItem={selectItem.value}
            data={props.schema}
            onUpdate:selectItem={(val) => updateSelectItem(val, true)}
            list={configTabs.value}
        >
            {configure.map(conf => {
              const { config, Component } = conf
              return config.name === currentTab.value && <Component
                key={config.name}
                schema={props.schema}
                onUpdate:schema={updateSchema}
                v-model:selectItem={selectItem.value}
              />
            })}
            { slots.configure?.({ name: currentTab.value, selectItem, updateSelectItem }) }
        </Property>,
        preview: () => <DeviceContainer type={'preview'} equipment={props.equipment} >

           {props.equipment === 'pc' &&
             <div class={ns.e('preview')} style={{ }}>
               <preview.Component
                 v-model:model={testModel.value}
                 schema={props.schema}
                 equipment={props.equipment}
               />
             </div>
           }
           {/* 预览组件需要使用 iframe */}
           { props.equipment === 'mobile' && <IframeContainer >
             <preview.Component
               v-model:model={testModel.value}
               schema={props.schema}
               equipment={props.equipment}
             />
           </IframeContainer>}
        </DeviceContainer>
      }}
    </DesignLayout>
  }
}
