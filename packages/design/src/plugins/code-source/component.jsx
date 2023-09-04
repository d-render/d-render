import CipCodeMirror from '@cip/code-mirror'
import { isJson } from '@d-render/shared'
export default {
  inheritAttrs: false,
  props: {
    schema: {}
  },
  emits: ['update:schema'],
  setup (props, { emit }) {
    return () => <CipCodeMirror
      height={'100%'}
      modelValue={JSON.stringify(props.schema)}
      onUpdate:modelValue={(v) => {
        if (isJson(v)) emit('update:schema', JSON.parse(v))
        console.log('code', JSON.parse(v))
      }}
    />
  }
}
