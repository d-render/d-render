import { Input } from 'ant-design-vue'
import TransformModel from '../transform-model'
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
    return () => <CipFormInputTransform
      {...attrs}
      inputPropsConfig={aInputProps}
      comp={<TransformModel
        comp={Input}
      />}
    />
  }
}
