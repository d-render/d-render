import { nextTick, ref, watch } from 'vue'
import { CipForm } from 'd-render'
import { getComponentConfigure } from './config'
import {
  configureOptionsFieldConfigMap,
  defaultConfigureOptions,
  generateFieldList
} from '@d-render/shared'
export default {
  name: 'DrDesignFieldConfig',
  inheritAttrs: false,
  props: {
    selectItem: { type: Object, default: () => ({}) },
    data: Object
  },
  emits: ['update:data', 'update:selectItem', 'update:tableItem'],
  setup (props, { emit }) {
    // TODO: 通过源代码修改，修改的值无法正常的回显，因为检测不到selectItem的变化
    const configBridge = ref({})
    watch(() => props.selectItem, (val) => {
      configBridge.value = val.config
      configBridge.value.key = val.key
      configBridge.value.id = val.id
    }, { immediate: true, deep: true })

    const getFieldComponentConfigureFieldConfigList = async (val) => {
      let configure
      try {
        configure = await getComponentConfigure(val)
      } catch (e) {
        // 若获取配置发生错误直接使用默认配置
        console.warn(`form-design: 获取${val}组件配置文件发生错误,使用默认配置进行替换`)
        configure = defaultConfigureOptions()
      }
      return generateFieldList(configure, configureOptionsFieldConfigMap)
    }
    const fieldComponentConfigureFieldConfigList = ref([])
    watch(() => configBridge.value.type, (val) => {
      if (val) {
        fieldComponentConfigureFieldConfigList.value = []
        // dependOn存在缓存问题，暂时先进行清空再赋值操作
        getFieldComponentConfigureFieldConfigList(val).then(res => {
          nextTick().then(() => {
            fieldComponentConfigureFieldConfigList.value = res
          })
        })
      } else {
        return []
      }
    }, { immediate: true })

    const updateSelectItem = (val) => {
      const selectItem = props.selectItem
      Reflect.deleteProperty(val, 'key')
      Reflect.deleteProperty(val, 'id')
      selectItem.config = val// { ...val }
      emit('update:selectItem', selectItem)
    }

    return () => <CipForm
      labelPosition="top"
      model={configBridge.value}
      onUpdate:model={updateSelectItem}
      fieldList={fieldComponentConfigureFieldConfigList.value}
      modelKey="id"
    />
  }
}
