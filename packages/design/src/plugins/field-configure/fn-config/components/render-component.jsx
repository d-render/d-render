import { computed } from 'vue'

export default {
  props: {
    config: Object,
    Component: Object,
    value: {},
    otherValue: {}
  },
  emits: ['update:value', 'update:otherValue'],
  setup (props, { emit }) {
    const config = computed(() => {
      if (['radio', 'checkbox', 'select', 'dataDictionary'].includes(props.config.type)) {
        return { ...props.config, dependOn: [] } // dependOn有值无法正常渲染
      }
      return props.config
    })
    // 组件差异处理
    if (['roleDictionary'].includes(config.value.type)) {
      const onUpdate = (val) => {
        const values = val.map(v => typeof v === 'symbol' ? '' : v)
        emit('update:value', values[0])
        emit('update:otherValue', values.slice(1))
      }
      return () => <props.Component
        config={config.value}
        values={[props.value, ...props.otherValue]}
        // values={props.value}
        onStreamUpdate:model={onUpdate}
      />
    }
    if (['dateRange', 'timeRange', 'numberRange'].includes(config.value.type)) {
      const onUpdate = (val) => {
        if (val.length < 2) return
        emit('update:otherValue', val[1])
      }
      const onUpdateValue = (val) => {
        emit('update:value', val)
      }
      return () => <props.Component
        config={config.value}
        modelValue={props.value}
        onUpdate:modelValue={onUpdateValue}
        otherValue={props.otherValue}
        values={[props.value, props.otherValue]}
        onStreamUpdate:model={onUpdate}
      />
    }

    const onUpdate = (val) => {
      // can not revert a Symbol(empty) to string
      if (typeof val[0] === 'symbol' || typeof val[1] === 'symbol') { // 清空操作时会有symbol对象导致不能转为字符串用于输入框
        emit('update:value', '')
        emit('update:otherValue', '')
        return
      }
      emit('update:value', val[0])
      emit('update:otherValue', val[1])
    }

    return () => <props.Component
      config={config.value}
      modelValue={props.value}
      otherValue={props.otherValue}
      values={[props.value, props.otherValue]}
      onStreamUpdate:model={onUpdate}
    />
  }
}
