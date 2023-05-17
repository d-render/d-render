import { Input } from 'ant-design-vue'
import { CipFormInputTransform } from 'd-render'

export default {
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input'
  },
  name: 'AntDVInput',
  setup (props, { attrs }) {
    const aInputProps = [
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
    const AInput = (props) => {
      return <Input {...props} value={props.modelValue} onInput={(e) => props['onUpdate:modelValue'](e.target.value)}/>
    }
    return () => <CipFormInputTransform
      {...attrs}
      inputPropsConfig={aInputProps}
      comp={AInput}
    />
  }
}
