import { ElFormItem, ElSwitch } from 'element-plus'
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
    const renderValues = (item) => {
      return <div style={{ flex: 1 }}>
        <br />
        <ElFormItem label='字段禁用'>
          <ElSwitch v-model={item.config.disabled} />
        </ElFormItem>
        <ElFormItem label='隐藏标题'>
          <ElSwitch v-model={item.config.hideLabel} />
        </ElFormItem>
        <ElFormItem label='隐藏此项'>
          <ElSwitch v-model={item.config.hideItem} />
        </ElFormItem>
        {
          ['select', 'role'].includes(props.itemConfig.type) &&
            <ElFormItem label='多选'>
              <ElSwitch v-model={item.config.multiple} />
            </ElFormItem>
        }
      </div>
    }

    return () => (
      <BaseConfig
        fnType="config"
        updateModel={props.updateModel}
        itemConfig={props.itemConfig}
        dependOnList={props.dependOnList}
        isCurrentInTable={props.isCurrentInTable}
        onUpdateConfig={(val) => emit('updateConfig', val)}
      >
        {{ renderValues }}
      </BaseConfig>
    )
  }
}
