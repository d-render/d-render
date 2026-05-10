import { computed } from 'vue'
import { ElSelect, ElOption } from 'element-plus'
import {
  formInputEmits,
  formInputProps,
  getFieldValue,
  isObject,
  useElementFormEvent,
  useFormInput,
  useInputProps,
  useOptions
} from '@d-render/shared'

/** 从 config 映射到 ElSelect 的字段（options 类由 useOptions 消费） */
const elSelectPropKeys = [
  'multiple',
  'placeholder',
  'clearable',
  'disabled',
  'filterable',
  'filterMethod',
  'remote',
  'remoteMethod',
  'loading',
  'multipleLimit',
  'name',
  'autocomplete',
  'size',
  'collapseTags',
  'collapseTagsTooltip',
  'maxCollapseTags',
  'effect',
  'popperClass',
  'teleported',
  'persistent',
  'automaticDropdown',
  'fitInputWidth',
  'suffixIcon',
  'tagType',
  'validateEvent',
  'noMatchText',
  'noDataText',
  'loadingText',
  'reserveKeyword',
  'defaultFirstOption',
  'allowCreate',
  'appendTo',
  'offset',
  'placement'
]

export default {
  name: 'StandardSelect',
  props: {
    ...formInputProps,
    style: [String, Object]
  },
  emits: formInputEmits,
  setup (props, context) {
    const { width, updateStream } = useFormInput(props, context)
    const { handleChange, handleBlur } = useElementFormEvent()

    const multiple = computed(() => !!props.config?.multiple)
    const { optionProps, options, proxyOptionsValue, getOptions } = useOptions(
      props,
      multiple,
      updateStream,
      context
    )

    const selectFieldProps = useInputProps(props, elSelectPropKeys)

    const rootStyle = computed(() => {
      const base = { width: width.value }
      const s = props.style
      if (!s) return base
      return typeof s === 'object' && s !== null ? { ...s, ...base } : base
    })

    const handleRemoteMethod = async (query) => {
      await getOptions(props.dependOnValues, props.outDependOnValues, { query })
    }

    return () => {
      const field = selectFieldProps.value
      let remoteMethod
      if (props.config?.remote) {
        remoteMethod = props.config.asyncOptions
          ? handleRemoteMethod
          : field.remoteMethod
      }

      const op = optionProps.value
      const list = options.value ?? []

      return (
        <ElSelect
          {...field}
          style={rootStyle.value}
          disabled={props.disabled}
          modelValue={proxyOptionsValue.value}
          onUpdate:modelValue={(v) => {
            proxyOptionsValue.value = v
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          remoteMethod={remoteMethod}
        >
          {list.map((option, i) => {
            if (isObject(option)) {
              const value = getFieldValue(option, op.value)
              const label = getFieldValue(option, op.label)
              const rawDis = getFieldValue(option, op.disabled)
              const dis =
                typeof rawDis === 'function' ? rawDis(option) : rawDis
              return (
                <ElOption
                  key={value ?? i}
                  value={value}
                  label={label}
                  disabled={dis}
                />
              )
            }
            return (
              <ElOption key={option} value={option} label={String(option)} />
            )
          })}
        </ElSelect>
      )
    }
  }
}
