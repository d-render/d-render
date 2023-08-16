import { CipFormInputTransform } from 'd-render'
import { ElInputNumber } from 'element-plus'
export default {
  name: 'StandardNumber',
  setup () {
    const elInputProps = [
      'min',
      'max',
      'step',
      'stepStrictly',
      'precision',
      'size',
      'readonly',
      'disabled',
      'controls',
      'name',
      'label',
      'placeholder',
      'id',
      'valueOnClear',
      'validateEvent'
    ]

    return () => <CipFormInputTransform
      inputPropsConfig={elInputProps}
      comp={ElInputNumber}
    />
  }
}
