import BaseConfig from './components/base-config'

export default {
  props: {
    updateModel: Function,
    itemConfig: Object,
    dependOnList: Array,
    isCurrentInTable: Boolean // 当前字段是否为子表单内的字段
  },
  emits: ['updateConfig'],
  setup (props, { emit }) {
    return () => (
      <BaseConfig
        fnType="value"
        updateModel={props.updateModel}
        itemConfig={props.itemConfig}
        dependOnList={props.dependOnList}
        isCurrentInTable={props.isCurrentInTable}
        onUpdateConfig={(val) => emit('updateConfig', val)}
      ></BaseConfig>
    )
  }
}
