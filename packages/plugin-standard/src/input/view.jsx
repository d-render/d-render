import { formInputViewProps } from '@d-render/shared'
export default {
  name: 'StandardInputView',
  props: formInputViewProps,
  setup (props) {
    return () => <span>{props.modelValue ? props.modelValue.toString() : ''}</span>
  }
}
