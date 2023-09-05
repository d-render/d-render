import { ref, watch } from 'vue'
import CipInput from '@cip/components/cip-input'
import { formInputProps, useFormInput } from '@d-render/shared'

export default {
  props: formInputProps,
  emits: ['update:modelValue', 'streamUpdate:model'],
  setup (props, ctx) {
    const {
      securityConfig,
      proxyValue,
      updateStream,
      proxyOtherValue
    } = useFormInput(props, ctx, { maxOtherKey: 100 })
    console.log('%c%s', 'color: #07FCFB;', '[Testing]~~', props)

    return () => <CipInput v-model={proxyValue.value}></CipInput>
  }
}
