import { computed, defineComponent, ExtractPropTypes } from 'vue'
import type { PropType } from 'vue'
import { useInputProps, useFormInput, formInputProps, useElementFormEvent, IAnyObject } from '@d-render/shared'

const tFromInputProps = {
  ...formInputProps,
  style: [String, Object] as PropType<string| IAnyObject>,
  onChange: Function as PropType<()=>void>,
  onBlur: Function as PropType<()=>void>
}

type ICompProps = ExtractPropTypes<typeof tFromInputProps>
export default defineComponent({
  name: 'CipFormInputTransform',
  props: {
    ...formInputProps,
    inputPropsConfig: { type: Array as PropType<Parameters<typeof useInputProps>['1']>, default: () => [] },
    formInputOptions: { type: Object, default: undefined },
    comp: { type: [Object, Function] as PropType<(props: ICompProps)=> JSX.Element>, required: true }
  },
  // emits: formInputEmits,
  setup (props, context) {
    const { width, proxyValue, proxyOtherValue } = useFormInput(props, context, props.formInputOptions)
    const otherValueListener = proxyOtherValue.reduce((acc:Record<string, (e: unknown)=> void>, v, idx) => {
      acc[`onUpdate:other${idx}`] = ($event) => { v.value = $event }
      return acc
    }, {})
    const otherValueProps = computed(() => proxyOtherValue.reduce((acc: Record<string, unknown>, v, idx) => {
      acc[`other${idx}`] = v.value
      return acc
    }, {}))
    const inputProps = useInputProps(props, props.inputPropsConfig)
    const { handleChange, handleBlur } = useElementFormEvent()
    if (!props.comp) return new Error('comp must be an component')
    return () => {
      const Comp = props.comp
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
        onChange={() => { handleChange() }}
        onBlur={() => { handleBlur() }}
        usingRules={props.usingRules}
        showTemplate={props.showTemplate}
        config={props.config}
      />
    }
  }

})
