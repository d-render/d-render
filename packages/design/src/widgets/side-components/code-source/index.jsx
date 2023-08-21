import CipCodeMirror from '@cip/code-mirror'
import { isJson } from '@d-render/shared'
export default {
  props: {
    modelValue: {}
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    return () => <CipCodeMirror
      height={'100%'}
      modelValue={JSON.stringify(props.modelValue)}
      onUpdate:modelValue={(v) => {
        if (isJson(v)) emit('update:modelValue', JSON.parse(v))
        console.log('code', JSON.parse(v))
      }}
    />
  }
}
