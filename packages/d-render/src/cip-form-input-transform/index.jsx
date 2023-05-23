import { useInputProps, useFormInput, formInputProps, useElementFormEvent } from '@d-render/shared'
import { computed } from 'vue'
export default {
  name: 'CipFormInputTransform',

  props: {
    ...formInputProps,
    inputPropsConfig: { type: Array, default: () => [] },
    formInputOptions: { type: Object, default: undefined },
    comp: { type: [Object, Function], required: true }
  },
  // emits: formInputEmits,
  setup (props, context) {
    const { width, proxyValue, proxyOtherValue } = useFormInput(props, context, props.formInputOptions)
    const otherValueListener = proxyOtherValue.reduce((acc, v, idx) => {
      acc[`onUpdate:other${idx}`] = ($event) => { v.value = $event }
      return acc
    }, {})
    const otherValueProps = computed(() => proxyOtherValue.reduce((acc, v, idx) => {
      acc[`other${idx}`] = v.value
      return acc
    }, {}))
    const inputProps = useInputProps(props, props.inputPropsConfig)
    const { handleChange, handleBlur } = useElementFormEvent()
    if (!props.comp) return new Error('comp must be an component')
    return () => {
      const Comp = props.comp
      return <Comp
        {...inputProps.value}
        {...otherValueProps.value}
        {...otherValueListener}
        disabled={props.disabled}
        dependOnValues={props.dependOnValues}
        outDependOnValues={props.outDependOnValues}
        tableData={props.tableData}
        onSearch={props.onSearch}
        style={{ width: width.value }}
        values={props.values}
        v-model={proxyValue.value}
        onChange={(e) => { handleChange() }}
        onBlur={(e) => { handleBlur() }}
      />
    }
  }

}
