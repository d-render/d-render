import { Input } from 'ant-design-vue'
import TransformModel from '../transform-model'
import { CipFormInputTransform } from 'd-render'

export default {
  name: 'AntDVInput',
  setup () {
    const aInputProps = [
      'addonAfter',
      'addonBefore',
      'allowClear',
      'bordered',
      'disabled',
      'id',
      'maxlength',
      'prefix',
      'showCount',
      'size',
      'suffix',
      ['inputType', 'type'],
      'readonly'
    ]
    return () => <CipFormInputTransform
      inputPropsConfig={aInputProps}
      comp={<TransformModel
        comp={Input}
      />}
    />
  }
}
