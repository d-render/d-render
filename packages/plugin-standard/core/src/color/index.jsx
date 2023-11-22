import { CipFormInputTransform } from 'd-render'
import { ElColorPicker } from 'element-plus'
export default {
  name: 'StandardColor',
  setup () {
    const elInputProps = [
      'size',
      'showAlpha',
      'colorFormat',
      'popperClass',
      'predefine',
      'validateEvent',
      'tabindex',
      'label',
      'id'
    ]

    return () => <CipFormInputTransform
      inputPropsConfig={elInputProps}
      comp={ElColorPicker}
    />
  }
}
