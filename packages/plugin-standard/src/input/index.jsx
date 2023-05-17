import { CipFormInputTransform } from 'd-render'
import { ElInput } from 'element-plus'
export default {
  name: 'StandardInput',
  setup () {
    const elInputProps = [
      'size',
      'maxlength',
      'minlength',
      'showWordLimit',
      'placeholder',
      'clearable',
      'formatter',
      'parser',
      'disabled',
      'size',
      'prefixIcon',
      'suffixIcon',
      'name',
      'readonly'
    ]

    return () => <CipFormInputTransform
      inputPropsConfig={elInputProps}
      comp={ElInput}
    />
  }
}
