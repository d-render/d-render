import { computed } from 'vue'
import { getFieldValue, isObject } from '@d-render/shared'

const OptionComponent = {
  props: {
    item: {},
    option: [Object, String, Number],
    index: Number,
    optionProps: Object,
    isObjectOption: Boolean,
    config: Object,
    optionValueProp: String,
    optionConfig: Object
  },
  setup (props) {
    const ItemComponent = computed(() => props.item)
    const labelBridge = computed(() => {
      return getFieldValue(props.option, props.optionProps.label)
    })
    const valueBridge = computed(() => {
      return getFieldValue(props.option, props.optionProps.value)
    })
    const disabledBridge = computed(() => {
      return getFieldValue(props.option, props.optionProps.disabled)
    })

    const defaultSlot = computed(() => {
      const slot = props.optionProps.slots?.default
      if (slot) {
        return slot({ option: props.option, index: props.index })
      } else {
        return labelBridge.value
      }
    })
    return () => <ItemComponent.value
      {...props.config}
      {...{ [props.optionValueProp || 'value']: valueBridge.value }}
      disabled={
        typeof disabledBridge.value === 'function'
          ? disabledBridge.value(props.option)
          : disabledBridge.value
      }
    >
      {defaultSlot.value}
    </ItemComponent.value>
  }
}

export default {
  name: 'OptionsComponents',
  props: {
    group: {},
    item: {},
    options: Array,
    optionProps: {},
    optionValueProp: {},
    optionConfig: {}
  },
  setup (props) {
    const GroupComponent = computed(() => props.group)
    const isObjectOption = computed(() => isObject(props.options[0]))
    const optionPropsBridge = computed(() => Object.assign({}, {
      value: 'value',
      label: 'label',
      children: 'children',
      disabled: 'disabled'
    }, props.optionProps))
    return () => <GroupComponent.value>
        {props.options.map((option, i) => {
          return <OptionComponent
            key={getFieldValue(option, optionPropsBridge.value.value)}
            item={props.item}
            index={i}
            option={option}
            isObjectOption={isObjectOption.value}
            config={props.optionConfig}
            optionValueProp={props.optionValueProp}
            optionProps={optionPropsBridge.value}
        />
        })}
      </GroupComponent.value>
  }
}
